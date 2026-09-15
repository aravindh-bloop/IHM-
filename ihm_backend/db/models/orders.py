import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Numeric, Enum as AlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from ihm_backend.db.base import Base
from ihm_backend.db.models.users import Kitchen
from sqlalchemy.orm import relationship


class Orders(Base):
    __tablename__ = "orders"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    compiled_order_id: uuid.UUID = Column(UUID(as_uuid=True),
                                          ForeignKey("compiled_orders.id"),
                                          nullable=False)
    # Traceability back to the requesting stall/kitchen, set at compile time.
    stall_id: uuid.UUID | None = Column(UUID(as_uuid=True), ForeignKey("stall.id"), nullable=True)
    kitchen: Kitchen | None = Column(AlchemyEnum(Kitchen), nullable=True)
    raw_material_request_id: uuid.UUID | None = Column(
        UUID(as_uuid=True), ForeignKey("raw_material_requests.id"), nullable=True
    )
    item_name: str = Column(String, nullable=False)
    total_quantity: int = Column(Integer, nullable=False)
    delivered_quantity: int = Column(Integer, nullable=True)
    unit: str = Column(String, nullable=True)
    unit_price: float = Column(Numeric(10, 2), nullable=True)
    total_price: float = Column(Numeric(10, 2), nullable=True)
