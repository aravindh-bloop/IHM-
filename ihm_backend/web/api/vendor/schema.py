"""Vendor API schemas."""
from pydantic import BaseModel
from typing import List, Optional


class OrderItemForVendor(BaseModel):
    """Individual order item details for vendor"""
    item_id: str
    item_name: str
    total_quantity: int
    delivered_quantity: Optional[int] = None
    unit: Optional[str] = None
    unit_price: Optional[float] = None
    total_price: Optional[float] = None


class CompiledOrderForVendor(BaseModel):
    """Compiled order details for vendor dashboard"""
    order_id: str
    date: str
    required_date: Optional[str] = None  # delivery date
    status: str
    total_items: int
    total_price: Optional[float] = None
    invoice_number: Optional[str] = None
    delivered_at: Optional[str] = None
    items: List[OrderItemForVendor]


class VendorOrdersResponse(BaseModel):
    """Response for vendor orders listing"""
    orders: List[CompiledOrderForVendor]


class ItemStatusUpdate(BaseModel):
    """Update status for individual item"""
    item_id: str
    delivered_quantity: int
    unit_price: Optional[float] = None


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
    total_price: Optional[float] = None
