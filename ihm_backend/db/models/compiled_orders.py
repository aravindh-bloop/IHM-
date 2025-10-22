import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from ihm_backend.db.base import Base
from sqlalchemy.orm import relationship
from datetime import datetime


class CompiledOrders(Base):
    __tablename__ = "compiled_orders"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: DateTime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    vendor_id: uuid.UUID = Column(UUID(as_uuid=True),
                                          ForeignKey("user.id"),
                                          nullable=False)

    status: str = Column(String, default="pending", nullable=False)
    total_items: int = Column(Integer, nullable=False)
