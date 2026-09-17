from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import uuid


class HodSubmittedItem(BaseModel):
    id: uuid.UUID
    stall_id: uuid.UUID
    stall_name: str
    kitchen: str
    item_name: str
    chef_quantity: int
    hod_quantity: int
    in_stock: float          # from inventory
    net_required: float      # max(0, hod_quantity - in_stock)
    final_quantity: Optional[int] = None   # admin override
    unit: str
    vendor_category: str     # from inventory / item mapping
    required_date: Optional[date] = None
    created_at: datetime
    status: str

    class Config:
        from_attributes = True


class HodSubmittedResponse(BaseModel):
    message: str
    total_items: int
    items: List[HodSubmittedItem]


class AdminEditItemRequest(BaseModel):
    final_quantity: Optional[int] = None
    vendor_category: Optional[str] = None
    item_name: Optional[str] = None
    unit: Optional[str] = None


class InventoryItem(BaseModel):
    id: Optional[uuid.UUID] = None
    item_name: str
    quantity: float
    unit: str
    vendor_category: str  # seafood / vegetables_fruits / general_provisions
    low_stock_threshold: float = 5
    is_low_stock: bool = False

    class Config:
        from_attributes = True


class InventoryUpsertRequest(BaseModel):
    item_name: str
    quantity: float
    unit: str
    vendor_category: str
    low_stock_threshold: Optional[float] = None


class CompileRequest(BaseModel):
    required_date: Optional[date] = None  # if set, only compile items for this date
    unscheduled_only: bool = False  # when true, only compile items without a date


class CompileOrderResponse(BaseModel):
    message: str
    compiled_orders: List[dict]


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
    vendor_email: Optional[str] = None
    vendor_category: Optional[str]
    required_date: Optional[date] = None
    status: str
    total_items: int
    total_price: Optional[float] = None
    invoice_number: Optional[str] = None
    delivered_at: Optional[datetime] = None
    items: List[OrderDetail]


# ── BILLS ────────────────────────────────────────────────────────────────────

class BillConstituent(BaseModel):
    """A single compiled-order bill that contributed to a roll-up."""
    compiled_order_id: str
    invoice_number: Optional[str] = None
    delivered_at: Optional[datetime] = None
    required_date: Optional[date] = None
    total_price: float
    total_items: int


class BillBucket(BaseModel):
    """One aggregated bill row (daily / weekly / monthly per vendor category)."""
    bucket_key: str           # e.g. '2026-05-22', '2026-W21', '2026-05'
    bucket_label: str         # human readable
    period_start: date
    period_end: date
    vendor_category: str
    vendor_email: Optional[str] = None
    invoice_ref: str          # INV-… for daily; WK-… / MTH-… for roll-ups
    total_price: float
    total_orders: int
    total_items: int
    constituents: List[BillConstituent]


class BillsResponse(BaseModel):
    view: str                 # 'daily' | 'weekly' | 'monthly'
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    buckets: List[BillBucket]

    class Config:
        from_attributes = True


# ── GOODS RECEIPT (admin confirms vendor-frozen orders) ──────────────────────

class ReceiptItemUpdate(BaseModel):
    item_id: str
    delivered_quantity: Optional[int] = None
    unit_price: Optional[float] = None


class ConfirmReceiptRequest(BaseModel):
    items: Optional[List[ReceiptItemUpdate]] = None  # optional last-minute admin edits


class ConfirmReceiptResponse(BaseModel):
    message: str
    compiled_order_id: str
    invoice_number: str
    total_price: float
    delivered_at: datetime


# ── TRACKING (kitchen-wise / category-wise, daily/weekly/monthly) ───────────

class TrackingBucket(BaseModel):
    bucket_key: str
    bucket_label: str
    period_start: date
    period_end: date
    group_key: str            # kitchen name or vendor_category, depending on group_by
    total_price: float
    total_items: int
    total_orders: int


class TrackingSummaryResponse(BaseModel):
    view: str
    group_by: str              # 'kitchen' | 'category'
    buckets: List[TrackingBucket]
