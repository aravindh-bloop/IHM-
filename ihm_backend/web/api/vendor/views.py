"""Vendor API endpoints."""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Optional
from ihm_backend.db.dependencies import get_db_session
from ihm_backend.db.models.users import User, UserRole
from ihm_backend.db.models.orders import Orders
from ihm_backend.db.models.compiled_orders import CompiledOrders
from ihm_backend.web.api.vendor.schema import (
    VendorOrdersResponse,
    CompiledOrderForVendor,
    OrderItemForVendor,
    UpdateOrderStatusRequest,
    ItemStatusUpdate,
    SupplyHistoryResponse
)
from ihm_backend.web.dependencies.auth import require_role

router = APIRouter()


@router.get("/orders/incoming", response_model=List[CompiledOrderForVendor])
async def get_incoming_orders(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.VENDOR))
):
    """Get all incoming orders (compiled orders assigned to this vendor)"""
    
    # Get compiled orders for this vendor with status='pending'
    result = await db.execute(
        select(CompiledOrders)
        .where(
            CompiledOrders.vendor_id == current_user.id,
            CompiledOrders.status == "pending"
        )
        .order_by(CompiledOrders.created_at.desc())
    )
    compiled_orders = result.scalars().all()
    
    response = []
    for compiled_order in compiled_orders:
        # Get all order items for this compiled order
        orders_result = await db.execute(
            select(Orders).where(Orders.compiled_order_id == compiled_order.id)
        )
        orders = orders_result.scalars().all()
        
        order_items = [
            OrderItemForVendor(
                item_id=str(order.id),
                item_name=order.item_name,
                total_quantity=order.total_quantity,
                delivered_quantity=order.delivered_quantity
            )
            for order in orders
        ]
        
        response.append(
            CompiledOrderForVendor(
                order_id=str(compiled_order.id),
                date=compiled_order.created_at.isoformat(),
                status=compiled_order.status,
                total_items=compiled_order.total_items,
                items=order_items
            )
        )
    
    return response


@router.post("/orders/{order_id}/update-status")
async def update_order_status(
    order_id: uuid.UUID,
    update_data: UpdateOrderStatusRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.VENDOR))
):
    """Update order item availability and delivered quantities"""
    
    # Verify the compiled order belongs to this vendor
    compiled_order_result = await db.execute(
        select(CompiledOrders).where(
            CompiledOrders.id == order_id,
            CompiledOrders.vendor_id == current_user.id
        )
    )
    compiled_order = compiled_order_result.scalar_one_or_none()
    
    if not compiled_order:
        raise HTTPException(status_code=404, detail="Order not found or not authorized")
    
    # Update individual order items
    for item_update in update_data.items:
        await db.execute(
            update(Orders)
            .where(Orders.id == uuid.UUID(item_update.item_id))
            .values(delivered_quantity=item_update.delivered_quantity)
        )
    
    # Mark order as completed if specified
    if update_data.mark_as_completed:
        compiled_order.status = "completed"
    
    await db.commit()
    
    return {
        "message": "Order status updated successfully",
        "order_id": str(order_id)
    }


@router.get("/orders/history", response_model=List[SupplyHistoryResponse])
async def get_supply_history(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.VENDOR))
):
    """Get vendor's supply history (completed/cancelled orders)"""
    
    result = await db.execute(
        select(CompiledOrders)
        .where(
            CompiledOrders.vendor_id == current_user.id,
            CompiledOrders.status.in_(["completed", "cancelled"])
        )
        .order_by(CompiledOrders.created_at.desc())
    )
    compiled_orders = result.scalars().all()
    
    history = []
    for order in compiled_orders:
        # Count items in this order
        orders_result = await db.execute(
            select(Orders).where(Orders.compiled_order_id == order.id)
        )
        item_count = len(orders_result.scalars().all())
        
        history.append(
            SupplyHistoryResponse(
                order_id=str(order.id),
                date=order.created_at.isoformat(),
                item_count=item_count,
                status=order.status
            )
        )
    
    return history
