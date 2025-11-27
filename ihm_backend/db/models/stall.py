import uuid
from sqlalchemy import Column , String, ForeignKey, Enum as AlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from  ihm_backend.db.base import Base
from sqlalchemy.orm import relationship
from ihm_backend.db.models.users import Kitchen


class Stall(Base):
    __tablename__ = "stall"
    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stall_name: str = Column(String, nullable=False)
    kitchen: Kitchen = Column(AlchemyEnum(Kitchen), nullable=False)
    operator_id: uuid.UUID = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    operator = relationship("User", back_populates="stalls")
