import uuid
from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from ihm_backend.db.base import Base
from sqlalchemy.orm import relationship


class Orders(Base):
    __tablename__ = "orders"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    compiled_order_id: uuid.UUID = Column(UUID(as_uuid=True),
                                          ForeignKey("compiled_orders.id"),
                                          nullable=False)
    item_name: str = Column(String, nullable=False)
    total_quantity: int = Column(Integer, nullable=False)
    delivered_quantity: int = Column(Integer, nullable=True)
