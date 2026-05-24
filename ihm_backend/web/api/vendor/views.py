"""Vendor API endpoints."""
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func
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
from ihm_backend.services.email import send_invoice_email, send_order_notification_email
from ihm_backend.settings import settings

router = APIRouter()


CATEGORY_PREFIX = {
    "seafood": "SEA",
    "vegetables_fruits": "VEG",
    "general_provisions": "GEN",
}


async def _generate_invoice_number(db: AsyncSession, category: str | None) -> str:
    """INV-YYYYMMDD-CAT-NNN, where NNN is the count of today's invoices for that category + 1."""
    prefix = CATEGORY_PREFIX.get(category or "", "GEN")
    today = datetime.utcnow().strftime("%Y%m%d")
    base = f"INV-{today}-{prefix}-"
    result = await db.execute(
        select(func.count()).select_from(CompiledOrders).where(
            CompiledOrders.invoice_number.like(f"{base}%")
        )
    )
    count = result.scalar() or 0
    return f"{base}{count + 1:03d}"


@router.get("/orders/incoming", response_model=List[CompiledOrderForVendor])
async def get_incoming_orders(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.VENDOR))
):
    """Get all incoming orders (compiled orders assigned to this vendor)"""
    print(f"\n=== VENDOR INCOMING ORDERS ===")
    print(f"Vendor ID: {current_user.id}")
    print(f"Vendor email: {current_user.email}")
    
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
    print(f"Found {len(compiled_orders)} pending compiled orders")
    
    response = []
    for compiled_order in compiled_orders:
        # Get all order items for this compiled order
        orders_result = await db.execute(
            select(Orders).where(Orders.compiled_order_id == compiled_order.id)
        )
        orders = orders_result.scalars().all()
        print(f"  Order {compiled_order.id}: {len(orders)} items")
        
        order_items = [
            OrderItemForVendor(
                item_id=str(order.id),
                item_name=order.item_name,
                total_quantity=order.total_quantity,
                delivered_quantity=order.delivered_quantity,
                unit=order.unit,
                unit_price=float(order.unit_price) if order.unit_price else None,
                total_price=float(order.total_price) if order.total_price else None
            )
            for order in orders
        ]

        response.append(
            CompiledOrderForVendor(
                order_id=str(compiled_order.id),
                date=compiled_order.created_at.isoformat(),
                required_date=compiled_order.required_date.isoformat() if compiled_order.required_date else None,
                status=compiled_order.status,
                total_items=compiled_order.total_items,
                total_price=float(compiled_order.total_price) if compiled_order.total_price else None,
                invoice_number=compiled_order.invoice_number,
                delivered_at=compiled_order.delivered_at.isoformat() if compiled_order.delivered_at else None,
                items=order_items
            )
        )
    
    print(f"Returning {len(response)} incoming orders")
    print(f"=== END INCOMING ORDERS ===")
    return response


@router.post("/orders/{order_id}/update-status")
async def update_order_status(
    order_id: uuid.UUID,
    update_data: UpdateOrderStatusRequest,
    background_tasks: BackgroundTasks,
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

    if compiled_order.status == "delivered":
        raise HTTPException(status_code=400, detail="This order has already been billed and cannot be modified")

    # Update individual order items and collect item details for email
    total_price_sum = 0.0
    order_items = []

    for item_update in update_data.items:
        order_item_result = await db.execute(
            select(Orders).where(Orders.id == uuid.UUID(item_update.item_id))
        )
        order_item = order_item_result.scalar_one_or_none()
        if not order_item:
            continue

        # Vendor cannot deliver more than was ordered
        if item_update.delivered_quantity > order_item.total_quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Delivered quantity ({item_update.delivered_quantity}) for "
                       f"'{order_item.item_name}' exceeds ordered quantity ({order_item.total_quantity})"
            )
        if item_update.delivered_quantity < 0:
            raise HTTPException(status_code=400, detail="Delivered quantity cannot be negative")

        # When generating the final bill, unit price is required
        if update_data.mark_as_completed and item_update.unit_price is None:
            raise HTTPException(
                status_code=400,
                detail=f"Unit price required for '{order_item.item_name}' to generate the bill"
            )

        line_total = None
        if item_update.unit_price is not None:
            line_total = float(item_update.unit_price) * item_update.delivered_quantity
            total_price_sum += line_total

        await db.execute(
            update(Orders)
            .where(Orders.id == uuid.UUID(item_update.item_id))
            .values(
                delivered_quantity=item_update.delivered_quantity,
                unit_price=item_update.unit_price,
                total_price=line_total
            )
        )

        order_items.append({
            'item_name': order_item.item_name,
            'total_quantity': order_item.total_quantity,
            'delivered_quantity': item_update.delivered_quantity,
            'unit': order_item.unit or 'kg',
            'unit_price': item_update.unit_price or 0,
            'total_price': line_total or 0
        })

    compiled_order.total_price = total_price_sum if total_price_sum > 0 else compiled_order.total_price

    invoice_number = None
    if update_data.mark_as_completed:
        invoice_number = await _generate_invoice_number(db, compiled_order.vendor_category)
        compiled_order.status = "delivered"
        compiled_order.invoice_number = invoice_number
        compiled_order.delivered_at = datetime.utcnow()

        # Email admins the invoice
        order_data = {
            'order_id': str(order_id),
            'invoice_number': invoice_number,
            'order_date': compiled_order.created_at.strftime('%Y-%m-%d'),
            'delivered_at': compiled_order.delivered_at.strftime('%Y-%m-%d %H:%M'),
            'required_date': compiled_order.required_date.isoformat() if compiled_order.required_date else None,
            'status': 'delivered',
            'total_items': len(order_items),
            'total_price': total_price_sum,
            'items': order_items,
            'vendor_name': current_user.email
        }
        try:
            admin_result = await db.execute(select(User).where(User.role == UserRole.ADMIN))
            admin_emails = [a.email for a in admin_result.scalars() if a.email] or [settings.admin_email]
            if admin_emails:
                background_tasks.add_task(send_invoice_email, admin_emails, order_data)
        except Exception as e:
            print(f"Error scheduling email: {e}")

    await db.commit()

    return {
        "message": "Bill generated successfully" if update_data.mark_as_completed else "Order draft saved",
        "order_id": str(order_id),
        "invoice_number": invoice_number,
        "total_price": total_price_sum,
        "delivered": update_data.mark_as_completed,
    }


@router.get("/orders/history", response_model=List[CompiledOrderForVendor])
async def get_supply_history(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_role(UserRole.VENDOR))
):
    """Get vendor's supply history (completed/cancelled orders)"""
    print(f"\n=== VENDOR SUPPLY HISTORY ===")
    print(f"Vendor ID: {current_user.id}")
    
    result = await db.execute(
        select(CompiledOrders)
        .where(
            CompiledOrders.vendor_id == current_user.id,
            CompiledOrders.status.in_(["delivered", "cancelled"])
        )
        .order_by(CompiledOrders.delivered_at.desc().nullslast(), CompiledOrders.created_at.desc())
    )
    compiled_orders = result.scalars().all()
    print(f"Found {len(compiled_orders)} delivered/cancelled orders")
    
    history = []
    for order in compiled_orders:
        # Get all order items for this compiled order
        orders_result = await db.execute(
            select(Orders).where(Orders.compiled_order_id == order.id)
        )
        orders = orders_result.scalars().all()
        print(f"  Order {order.id}: {len(orders)} items, status={order.status}")

        order_items = [
            OrderItemForVendor(
                item_id=str(item.id),
                item_name=item.item_name,
                total_quantity=item.total_quantity,
                delivered_quantity=item.delivered_quantity,
                unit=item.unit,
                unit_price=float(item.unit_price) if item.unit_price else None,
                total_price=float(item.total_price) if item.total_price else None
            )
            for item in orders
        ]

        history.append(
            CompiledOrderForVendor(
                order_id=str(order.id),
                date=order.created_at.isoformat(),
                required_date=order.required_date.isoformat() if order.required_date else None,
                status=order.status,
                total_items=len(orders),
                total_price=float(order.total_price) if order.total_price else None,
                invoice_number=order.invoice_number,
                delivered_at=order.delivered_at.isoformat() if order.delivered_at else None,
                items=order_items
            )
        )
    
    print(f"Returning {len(history)} history items")
    print(f"=== END SUPPLY HISTORY ===")
    return history
