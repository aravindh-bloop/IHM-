from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid


class MergedItem(BaseModel):
    item_name: str
    total_quantity: int
    unit: str
    kitchen: str


class RawMaterialRequestDetail(BaseModel):
    id: uuid.UUID
    stall_id: uuid.UUID
    stall_name: str
    kitchen: str
    item_name: str
    quantity: int
    approved_quantity: Optional[int] = None
    unit: str
    created_at: datetime
    status: str

    class Config:
        from_attributes = True


class PendingOrdersResponse(BaseModel):
    message: str
    total_requests: int
    merged_items: List[MergedItem]
    raw_requests: List[RawMaterialRequestDetail]


class CompileOrderItem(BaseModel):
    item_name: str
    total_quantity: int
    unit: str


class CompileOrderRequest(BaseModel):
    items: List[CompileOrderItem]


class UpdateRequestStatusRequest(BaseModel):
    status: str  # approved, rejected
    approved_quantity: Optional[int] = None


class CompileOrderResponse(BaseModel):
    message: str
    compiled_order_id: str
    total_items: int
    items: List[dict]


class OrderDetail(BaseModel):
    order_id: str
    item_name: str
    total_quantity: int
    delivered_quantity: Optional[int] = None
    unit: Optional[str] = None
    unit_price: Optional[float] = None
    total_price: Optional[float] = None


class CompiledOrderDetail(BaseModel):
    id: str
    created_at: datetime
    vendor_id: Optional[str]
    status: str
    total_items: int
    total_price: Optional[float] = None
    items: List[OrderDetail]

    class Config:
        from_attributes = True
