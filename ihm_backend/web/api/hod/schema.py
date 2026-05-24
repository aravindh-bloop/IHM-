from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import uuid


class HodRequestDetail(BaseModel):
    id: uuid.UUID
    stall_id: uuid.UUID
    stall_name: str
    kitchen: str
    item_name: str
    quantity: int           # chef's original
    hod_quantity: Optional[int] = None  # HOD-edited
    unit: str
    required_date: Optional[date] = None
    created_at: datetime
    status: str

    class Config:
        from_attributes = True


class HodPendingResponse(BaseModel):
    message: str
    total_requests: int
    raw_requests: List[HodRequestDetail]


class HodEditRequest(BaseModel):
    item_name: Optional[str] = None
    hod_quantity: Optional[int] = None
    unit: Optional[str] = None


class HodAddItemRequest(BaseModel):
    item_name: str
    hod_quantity: int
    unit: str
    stall_id: uuid.UUID
    required_date: date


class HodSubmitResponse(BaseModel):
    message: str
    submitted_count: int
