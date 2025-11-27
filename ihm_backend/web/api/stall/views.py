import uuid
from fastapi import APIRouter, Depends, HTTPException
from ihm_backend.web.api.stall.schema import ItemRequest, ItemUpdate, RawMaterialRequestResponse
from ihm_backend.db.dependencies import get_db_session
from sqlalchemy.ext.asyncio import AsyncSession
from ihm_backend.db.models.raw_material import RawMaterialRequests
from ihm_backend.db.models.users import User
from ihm_backend.db.models.stall import Stall
from fastapi_users import FastAPIUsers
from ihm_backend.db.models.users import api_users
from ihm_backend.web.dependencies.auth import require_kitchen_access
from sqlalchemy import select, delete

router = APIRouter()


@router.post("/request", response_model=RawMaterialRequestResponse)
async def handle_request(
    item_data: ItemRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_kitchen_access)
):
    result = await db.execute(
        select(Stall).where(
            (Stall.operator_id == current_user.id) &
            (Stall.kitchen == current_user.kitchen)
        )
    )
    stall = result.scalar_one_or_none()

    if not stall:
        raise HTTPException(
            status_code=404, 
            detail="No stall found for this user in your assigned kitchen"
        )

    created_requests = []
    for item in item_data.items:
        request = RawMaterialRequests(
            stall_id=stall.id,
            item_name=item.item_name,
            quantity=item.quantity,
            unit = item.unit
        )
        db.add(request)
        created_requests.append({
            "item_name": item.item_name,
            "quantity": item.quantity
        })

    await db.commit()

    return {
        "message": "Raw material requests created successfully",
        "stall_id": str(stall.id),
        "stall_name": stall.stall_name,
        "requests": created_requests
    }
@router.get("/request", response_model=RawMaterialRequestResponse)
async def get_requests(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_kitchen_access)
):
    result = await db.execute(
        select(Stall).where(
            (Stall.operator_id == current_user.id) &
            (Stall.kitchen == current_user.kitchen)
        )
    )
    stall = result.scalar_one_or_none()

    if not stall:
        raise HTTPException(
            status_code=404, 
            detail="No stall found for this user in your assigned kitchen"
        )

    requests_res = await db.execute(
        select(RawMaterialRequests).where(RawMaterialRequests.stall_id ==
                                          stall.id)
    )
    requests = requests_res.scalars().all()

    return {
        "message": "Raw Material requests retrived successfully",
        "stall_id": str(stall.id),
        "stall_name": stall.stall_name,
        "requests": [
            {
                "id": req.id,
                "item_name": req.item_name,
                "quantity": req.quantity,
                "status": req.status,
                "unit": req.unit,
                "created_at": req.created_at
            }
            for req in requests
        ]
    }
@router.delete("/request/{request_id}")
async def delete_request(
    request_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_kitchen_access)
):
    result = await db.execute(
        select(Stall).where(
            (Stall.operator_id == current_user.id) &
            (Stall.kitchen == current_user.kitchen)
        )
    )
    stall = result.scalar_one_or_none()

    if not stall:
        raise HTTPException(
            status_code=404, 
            detail="No stall found for this user in your assigned kitchen"
        )

    request_result = await db.execute(
        select(RawMaterialRequests).where(
            (RawMaterialRequests.id == request_id) &
            (RawMaterialRequests.stall_id == stall.id)
        )
    )
    request_to_delete = request_result.scalar_one_or_none()

    if not request_to_delete:
        raise HTTPException(
            status_code=404,
            detail="Request not found or does not belong to your stall"
        )

    await db.execute(
        delete(RawMaterialRequests).where(RawMaterialRequests.id == request_id)
    )
    await db.commit()

    return {
        "message": "Request deleted successfully",
        "id": str(request_id),
        "item_name": request_to_delete.item_name
    }


@router.patch("/request/{request_id}")
async def update_request(
    request_id: uuid.UUID,
    update_data: ItemUpdate,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_kitchen_access)
):
    result = await db.execute(
        select(Stall).where(
            (Stall.operator_id == current_user.id) &
            (Stall.kitchen == current_user.kitchen)
        )
    )
    stall = result.scalar_one_or_none()

    if not stall:
        raise HTTPException(
            status_code=404, 
            detail="No stall found for this user in your assigned kitchen"
        )

    request_result = await db.execute(
        select(RawMaterialRequests).where(
            (RawMaterialRequests.id == request_id) &
            (RawMaterialRequests.stall_id == stall.id)
        )
    )
    request_to_update = request_result.scalar_one_or_none()

    if not request_to_update:
        raise HTTPException(
            status_code=404,
            detail="Request not found or does not belong to your stall"
        )

    update_dict = update_data.model_dump(exclude_unset=True)

    if not update_dict:
        raise HTTPException(
            status_code=400,
            detail="No fields provided to update"
        )

    for field, value in update_dict.items():
        setattr(request_to_update, field, value)

    await db.commit()
    await db.refresh(request_to_update)

    return {
        "message": "Request updated successfully",
        "id": str(request_to_update.id),
        "item_name": request_to_update.item_name,
        "quantity": request_to_update.quantity,
        "unit": request_to_update.unit,
        "status": request_to_update.status,
        "created_at": request_to_update.created_at.isoformat() if request_to_update.created_at else None
    }
