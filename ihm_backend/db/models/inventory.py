import uuid
from sqlalchemy import Column, String, Integer, DateTime, Numeric
from sqlalchemy.dialects.postgresql import UUID
from ihm_backend.db.base import Base
from datetime import datetime


class Inventory(Base):
    """Current stock levels tracked by admin."""
    __tablename__ = "inventory"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_name: str = Column(String, nullable=False, index=True)
    quantity: float = Column(Numeric(10, 2), nullable=False, default=0)
    unit: str = Column(String, nullable=False)
    vendor_category: str = Column(String, nullable=False, default="general_provisions")
    low_stock_threshold: float = Column(Numeric(10, 2), nullable=False, default=5)
    updated_at: datetime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
