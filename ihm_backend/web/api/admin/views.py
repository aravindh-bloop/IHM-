import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from ihm_backend.db.dependencies import get_db_session
from ihm_backend.db.models.users import User, api_users, UserRole
from ihm_backend.db.models.raw_material import RawMaterialRequests
from ihm_backend.db.models.orders import Orders
from ihm_backend.db.models.compiled_orders import CompiledOrders
from ihm_backend.db.models.stall import Stall
from ihm_backend.web.api.admin.schema import (
    PendingOrdersResponse,
    CompileOrderRequest,
    CompileOrderResponse,
    RawMaterialRequestDetail,
    MergedItem,
    CompiledOrderDetail,
    OrderDetail,
    UpdateRequestStatusRequest
)
from ihm_backend.web.dependencies.auth import require_role

router = APIRouter()


@router.get("/orders/pending", response_model=PendingOrdersResponse)
async def get_pending_raw_material_requests(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):

    result = await db.execute(
        select(RawMaterialRequests, Stall)
        .join(Stall, RawMaterialRequests.stall_id == Stall.id)
        .where(RawMaterialRequests.status == "pending")
    )
    requests_with_stalls = result.all()

    if not requests_with_stalls:
        return {
            "message": "No pending requests found",
            "total_requests": 0,
            "merged_items": [],
            "raw_requests": []
        }

    raw_requests = [
        RawMaterialRequestDetail(
            id=req.id,
            stall_id=req.stall_id,
            stall_name=stall.stall_name,
            kitchen=stall.kitchen.value,
            item_name=req.item_name,
            quantity=req.quantity,
            approved_quantity=req.approved_quantity,
            unit=req.unit,
            created_at=req.created_at,
            status=req.status
        )
        for req, stall in requests_with_stalls
    ]
    merged_dict = {}
    for req, stall in requests_with_stalls:
        key = f"{req.item_name}_{req.unit}"
        if key in merged_dict:
            merged_dict[key]["total_quantity"] += req.quantity
        else:
            merged_dict[key] = {
                "item_name": req.item_name,
                "total_quantity": req.quantity,
                "unit": req.unit,
                "kitchen": stall.kitchen.value
            }

    merged_items = [
        MergedItem(**item) for item in merged_dict.values()
    ]

    return {
        "message": "Pending requests retrieved successfully",
        "total_requests": len(raw_requests),
        "merged_items": merged_items,
        "raw_requests": raw_requests
    }


@router.patch("/orders/request/{request_id}")
async def update_request_status(
    request_id: uuid.UUID,
    update_data: UpdateRequestStatusRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Update individual raw material request status and approved quantity"""
    result = await db.execute(
        select(RawMaterialRequests).where(RawMaterialRequests.id == request_id)
    )
    request = result.scalar_one_or_none()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if request.status != "pending":
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot update request with status '{request.status}'"
        )
    
    # Validate status
    if update_data.status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=400, 
            detail="Status must be 'approved' or 'rejected'"
        )
    
    # Update the request
    request.status = update_data.status
    
    if update_data.status == "approved":
        if update_data.approved_quantity is None:
            # If no approved quantity specified, approve the full requested quantity
            request.approved_quantity = request.quantity
        else:
            # Validate approved quantity
            if update_data.approved_quantity < 0:
                raise HTTPException(
                    status_code=400,
                    detail="Approved quantity cannot be negative"
                )
            if update_data.approved_quantity > request.quantity:
                raise HTTPException(
                    status_code=400,
                    detail="Approved quantity cannot exceed requested quantity"
                )
            request.approved_quantity = update_data.approved_quantity
    else:
        # If rejected, set approved quantity to 0
        request.approved_quantity = 0
    
    await db.commit()
    await db.refresh(request)
    
    return {
        "message": f"Request {update_data.status} successfully",
        "id": str(request.id),
        "item_name": request.item_name,
        "requested_quantity": request.quantity,
        "approved_quantity": request.approved_quantity,
        "status": request.status
    }


@router.post("/orders/compile", response_model=CompileOrderResponse)
async def compile_and_send_to_vendor(
    order_data: CompileOrderRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    vendor_result = await db.execute(
        select(User).where(User.role == UserRole.VENDOR)
    )
    vendor = vendor_result.scalar_one_or_none()

    if not vendor:
        raise HTTPException(status_code=404, detail="No vendor found in system")

    compiled_order = CompiledOrders(
        vendor_id=vendor.id,
        status="pending",
        total_items=len(order_data.items)
    )
    db.add(compiled_order)
    await db.flush()

    created_orders = []
    for item in order_data.items:
        order = Orders(
            compiled_order_id=compiled_order.id,
            item_name=item.item_name,
            total_quantity=item.total_quantity,
            unit=item.unit
        )
        db.add(order)
        created_orders.append({
            "item_name": item.item_name,
            "total_quantity": item.total_quantity,
            "unit": item.unit
        })
    
    # Mark only approved requests as compiled
    approved_requests = await db.execute(
        select(RawMaterialRequests).where(RawMaterialRequests.status == "approved")
    )
    for req in approved_requests.scalars():
        req.status = "compiled"
    
    # Mark rejected requests as rejected (they won't be compiled)
    rejected_requests = await db.execute(
        select(RawMaterialRequests).where(RawMaterialRequests.status == "rejected")
    )
    for req in rejected_requests.scalars():
        req.status = "rejected"

    await db.commit()

    return {
        "message": "Order compiled and sent to vendor successfully",
        "compiled_order_id": str(compiled_order.id),
        "total_items": len(created_orders),
        "items": created_orders
    }


@router.get("/orders/compiled", response_model=List[CompiledOrderDetail])
async def get_compiled_orders(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):

    compiled_orders_result = await db.execute(
        select(CompiledOrders).order_by(CompiledOrders.created_at.desc())
    )
    compiled_orders = compiled_orders_result.scalars().all()

    result = []
    for compiled_order in compiled_orders:
        orders_result = await db.execute(
            select(Orders).where(Orders.compiled_order_id == compiled_order.id)
        )
        orders = orders_result.scalars().all()

        order_details = [
            OrderDetail(
                order_id=str(order.id),
                item_name=order.item_name,
                total_quantity=order.total_quantity,
                delivered_quantity=order.delivered_quantity,
                unit=order.unit,
                unit_price=float(order.unit_price) if order.unit_price else None,
                total_price=float(order.total_price) if order.total_price else None
            )
            for order in orders
        ]

        result.append(
            CompiledOrderDetail(
                id=str(compiled_order.id),
                created_at=compiled_order.created_at,
                vendor_id=str(compiled_order.vendor_id) if compiled_order.vendor_id else None,
                status=compiled_order.status,
                total_items=compiled_order.total_items,
                total_price=float(compiled_order.total_price) if compiled_order.total_price else None,
                orders=order_details
            )
        )

    return result


@router.get("/orders/compiled/{compiled_order_id}", response_model=CompiledOrderDetail)
async def get_compiled_order_by_id(
    compiled_order_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Get specific compiled order details"""

    compiled_order_result = await db.execute(
        select(CompiledOrders).where(CompiledOrders.id == compiled_order_id)
    )
    compiled_order = compiled_order_result.scalar_one_or_none()

    if not compiled_order:
        raise HTTPException(status_code=404, detail="Compiled order not found")

    orders_result = await db.execute(
        select(Orders).where(Orders.compiled_order_id == compiled_order.id)
    )
    orders = orders_result.scalars().all()

    order_details = [
        OrderDetail(
            order_id=str(order.id),
            item_name=order.item_name,
            total_quantity=order.total_quantity,
            delivered_quantity=order.delivered_quantity,
            unit=order.unit,
            unit_price=float(order.unit_price) if order.unit_price else None,
            total_price=float(order.total_price) if order.total_price else None
        )
        for order in orders
    ]

    return CompiledOrderDetail(
        id=str(compiled_order.id),
        created_at=compiled_order.created_at,
        vendor_id=str(compiled_order.vendor_id) if compiled_order.vendor_id else None,
        status=compiled_order.status,
        total_items=compiled_order.total_items,
        total_price=float(compiled_order.total_price) if compiled_order.total_price else None,
        orders=order_details
    )
