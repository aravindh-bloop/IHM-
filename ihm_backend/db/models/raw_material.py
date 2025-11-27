import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from ihm_backend.db.base import Base
from sqlalchemy.orm import relationship
from datetime import datetime

#id, stall_id, item_name, quantity, unit, request_date, status
class RawMaterialRequests(Base):
    __tablename__ = "raw_material_requests"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stall_id: uuid.UUID = Column(UUID(as_uuid=True),
                                          ForeignKey("stall.id"),
                                          nullable=False)
    item_name: str = Column(String, nullable=False)
    quantity: int = Column(Integer, nullable=False)
    approved_quantity: int | None = Column(Integer, nullable=True)
    unit: str = Column(String, nullable=False)
    created_at: DateTime = Column(DateTime, default=datetime.utcnow)
    status: str = Column(String, default="pending", nullable=False)
