import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from ihm_backend.db.base import Base
from sqlalchemy.orm import relationship
from datetime import datetime
class VendorUpdates(Base):
    __tablename__ = "vendor_updates"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    compiled_order_id: uuid.UUID = Column(UUID(as_uuid=True),
                                          ForeignKey("compiled_orders.id"),
                                          nullable=False)
    vendor_id: uuid.UUID = Column(UUID(as_uuid=True),
                                          ForeignKey("user.id"),
                                          nullable=False)
    status_update: str = Column(String, default="pending", nullable=False)
    last_updated: DateTime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
