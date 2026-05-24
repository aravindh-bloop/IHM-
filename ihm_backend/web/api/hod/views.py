import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from ihm_backend.db.dependencies import get_db_session
from ihm_backend.db.models.users import User, UserRole
from ihm_backend.db.models.raw_material import RawMaterialRequests
from ihm_backend.db.models.compiled_orders import CompiledOrders
from ihm_backend.db.models.orders import Orders
from ihm_backend.db.models.stall import Stall
from ihm_backend.web.api.hod.schema import (
    HodPendingResponse, HodRequestDetail,
    HodEditRequest, HodAddItemRequest, HodSubmitResponse
)
from ihm_backend.web.dependencies.auth import require_role

router = APIRouter()


@router.get("/orders/pending", response_model=HodPendingResponse)
async def get_pending_for_hod(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.HOD))
):
    """HOD sees all chef-submitted (pending) requests."""
    result = await db.execute(
        select(RawMaterialRequests, Stall)
        .join(Stall, RawMaterialRequests.stall_id == Stall.id)
        .where(RawMaterialRequests.status == "pending")
        .order_by(RawMaterialRequests.required_date.asc(), RawMaterialRequests.created_at.desc())
    )
    rows = result.all()
    raw_requests = [
        HodRequestDetail(
            id=req.id, stall_id=req.stall_id, stall_name=stall.stall_name,
            kitchen=stall.kitchen.value, item_name=req.item_name,
            quantity=req.quantity, hod_quantity=req.hod_quantity,
            unit=req.unit, required_date=req.required_date,
            created_at=req.created_at, status=req.status
        )
        for req, stall in rows
    ]
    return {"message": "Pending requests retrieved", "total_requests": len(raw_requests), "raw_requests": raw_requests}


@router.patch("/orders/request/{request_id}")
async def hod_edit_request(
    request_id: uuid.UUID,
    edit_data: HodEditRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.HOD))
):
    """HOD edits item name, quantity or unit on a pending request."""
    result = await db.execute(select(RawMaterialRequests).where(RawMaterialRequests.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending requests can be edited")

    if edit_data.item_name is not None:
        req.item_name = edit_data.item_name
    if edit_data.hod_quantity is not None:
        req.hod_quantity = edit_data.hod_quantity
    if edit_data.unit is not None:
        req.unit = edit_data.unit

    await db.commit()
    await db.refresh(req)
    return {"message": "Updated", "id": str(req.id), "item_name": req.item_name,
            "hod_quantity": req.hod_quantity, "unit": req.unit}


@router.delete("/orders/request/{request_id}")
async def hod_delete_request(
    request_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.HOD))
):
    """HOD removes an item from the pending list."""
    result = await db.execute(select(RawMaterialRequests).where(RawMaterialRequests.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending requests can be deleted")
    await db.execute(delete(RawMaterialRequests).where(RawMaterialRequests.id == request_id))
    await db.commit()
    return {"message": "Deleted", "id": str(request_id)}


@router.post("/orders/request")
async def hod_add_item(
    item_data: HodAddItemRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.HOD))
):
    """HOD adds a new item to the pending list for a given stall."""
    stall_result = await db.execute(select(Stall).where(Stall.id == item_data.stall_id))
    stall = stall_result.scalar_one_or_none()
    if not stall:
        raise HTTPException(status_code=404, detail="Stall not found")

    new_req = RawMaterialRequests(
        stall_id=item_data.stall_id,
        item_name=item_data.item_name,
        quantity=item_data.hod_quantity,
        hod_quantity=item_data.hod_quantity,
        unit=item_data.unit,
        required_date=item_data.required_date,
        status="pending"
    )
    db.add(new_req)
    await db.commit()
    await db.refresh(new_req)
    return {"message": "Item added", "id": str(new_req.id), "item_name": new_req.item_name}


@router.post("/orders/submit", response_model=HodSubmitResponse)
async def hod_submit_to_admin(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.HOD))
):
    """HOD finalises the list and submits all pending requests to admin."""
    result = await db.execute(
        select(RawMaterialRequests).where(RawMaterialRequests.status == "pending")
    )
    pending = result.scalars().all()
    if not pending:
        raise HTTPException(status_code=400, detail="No pending requests to submit")

    for req in pending:
        # If HOD didn't edit the quantity, carry the chef's quantity forward
        if req.hod_quantity is None:
            req.hod_quantity = req.quantity
        req.status = "hod_submitted"

    await db.commit()
    return {"message": "Submitted to admin successfully", "submitted_count": len(pending)}


@router.get("/orders/history")
async def hod_history(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.HOD))
):
    """HOD views all previously submitted requests and compiled orders."""
    result = await db.execute(
        select(RawMaterialRequests, Stall)
        .join(Stall, RawMaterialRequests.stall_id == Stall.id)
        .where(RawMaterialRequests.status != "pending")
        .order_by(RawMaterialRequests.created_at.desc())
    )
    rows = result.all()
    raw_history = [
        {
            "id": str(req.id), "stall_name": stall.stall_name, "kitchen": stall.kitchen.value,
            "item_name": req.item_name, "quantity": req.quantity,
            "hod_quantity": req.hod_quantity, "approved_quantity": req.approved_quantity,
            "unit": req.unit, "status": req.status,
            "required_date": req.required_date.isoformat() if req.required_date else None,
            "created_at": req.created_at.isoformat() if req.created_at else None
        }
        for req, stall in rows
    ]

    compiled_result = await db.execute(
        select(CompiledOrders).order_by(CompiledOrders.created_at.desc())
    )
    compiled_orders = compiled_result.scalars().all()
    compiled_history = []
    for co in compiled_orders:
        orders_result = await db.execute(select(Orders).where(Orders.compiled_order_id == co.id))
        orders = orders_result.scalars().all()
        compiled_history.append({
            "id": str(co.id),
            "created_at": co.created_at.isoformat() if co.created_at else None,
            "vendor_category": co.vendor_category,
            "status": co.status, "total_items": co.total_items,
            "total_price": float(co.total_price) if co.total_price else None,
            "items": [
                {"item_name": o.item_name, "total_quantity": o.total_quantity,
                 "delivered_quantity": o.delivered_quantity, "unit": o.unit,
                 "unit_price": float(o.unit_price) if o.unit_price else None,
                 "total_price": float(o.total_price) if o.total_price else None}
                for o in orders
            ]
        })

    return {"message": "History retrieved", "raw_requests": raw_history, "compiled_orders": compiled_history}


@router.get("/stalls")
async def get_all_stalls(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.HOD))
):
    """HOD gets list of stalls for the add-item form."""
    result = await db.execute(select(Stall))
    stalls = result.scalars().all()
    return [{"id": str(s.id), "stall_name": s.stall_name, "kitchen": s.kitchen.value} for s in stalls]
