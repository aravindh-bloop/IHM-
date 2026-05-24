import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Integer, Numeric, Date
from sqlalchemy.dialects.postgresql import UUID
from ihm_backend.db.base import Base
from datetime import datetime, date


class CompiledOrders(Base):
    __tablename__ = "compiled_orders"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: DateTime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    vendor_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    vendor_category: str = Column(String, nullable=True)  # seafood / vegetables_fruits / general_provisions
    required_date: date | None = Column(Date, nullable=True)  # delivery date for this compiled order
    # Status flow: pending -> delivered (vendor billed) | cancelled
    status: str = Column(String, default="pending", nullable=False)
    total_items: int = Column(Integer, nullable=False)
    total_price: float = Column(Numeric(10, 2), nullable=True)
    # Bill / invoice fields, filled when vendor generates bill
    invoice_number: str | None = Column(String, nullable=True, unique=True)
    delivered_at: DateTime | None = Column(DateTime, nullable=True)
