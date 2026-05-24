import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Integer, Date
from sqlalchemy.dialects.postgresql import UUID
from ihm_backend.db.base import Base
from datetime import datetime, date

# Status flow: draft -> pending -> hod_submitted -> admin_compiled / admin_rejected
class RawMaterialRequests(Base):
    __tablename__ = "raw_material_requests"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stall_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("stall.id"), nullable=False)
    item_name: str = Column(String, nullable=False)
    quantity: int = Column(Integer, nullable=False)          # chef's original quantity
    hod_quantity: int | None = Column(Integer, nullable=True)  # HOD-edited quantity
    approved_quantity: int | None = Column(Integer, nullable=True)  # admin final quantity
    unit: str = Column(String, nullable=False)
    required_date: date = Column(Date, nullable=False)        # the date these items are needed for
    created_at: DateTime = Column(DateTime, default=datetime.utcnow)
    status: str = Column(String, default="draft", nullable=False)
