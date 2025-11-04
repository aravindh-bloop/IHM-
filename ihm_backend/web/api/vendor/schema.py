"""Vendor API schemas."""
from pydantic import BaseModel
from typing import List, Optional


class OrderItemForVendor(BaseModel):
    """Individual order item details for vendor"""
    item_id: str
    item_name: str
    total_quantity: int
    delivered_quantity: Optional[int] = None


class CompiledOrderForVendor(BaseModel):
    """Compiled order details for vendor dashboard"""
    order_id: str
    date: str
    status: str
    total_items: int
    items: List[OrderItemForVendor]


class VendorOrdersResponse(BaseModel):
    """Response for vendor orders listing"""
    orders: List[CompiledOrderForVendor]


class ItemStatusUpdate(BaseModel):
    """Update status for individual item"""
    item_id: str
    delivered_quantity: int


class UpdateOrderStatusRequest(BaseModel):
    """Request to update order status"""
    items: List[ItemStatusUpdate]
    mark_as_completed: bool = False


class SupplyHistoryResponse(BaseModel):
    """Supply history record"""
    order_id: str
    date: str
    item_count: int
    status: str
