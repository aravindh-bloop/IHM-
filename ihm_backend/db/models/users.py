# type: ignore
import uuid
import enum
from fastapi import Depends
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin, schemas
from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import Column, String, Enum as AlchemyEnum, DateTime, Text
from ihm_backend.db.base import Base
from ihm_backend.db.dependencies import get_db_session
from ihm_backend.settings import settings
from datetime import datetime

from sqlalchemy.orm import relationship

class UserRole(str, enum.Enum):
    """user roles"""
    ADMIN = "admin"
    STALL_OWNER = "stall"
    VENDOR = "vendor"
    HOD = "hod"


class Kitchen(str, enum.Enum):
    """kitchen types"""
    ATK = "ATK"
    BTK = "BTK"
    QTK = "QTK"
    CRAFT = "CRAFT"


class VendorCategory(str, enum.Enum):
    """vendor specialisation"""
    SEAFOOD = "seafood"
    VEGETABLES_FRUITS = "vegetables_fruits"
    GENERAL_PROVISIONS = "general_provisions"


class User(SQLAlchemyBaseUserTableUUID, Base):
    """Represents a user entity."""

    role: UserRole = Column(AlchemyEnum(UserRole), nullable=False)
    kitchen: Kitchen | None = Column(AlchemyEnum(Kitchen), nullable=True)
    vendor_category: str | None = Column(String, nullable=True)  # seafood / vegetables_fruits / general_provisions
    created_at: datetime = Column(DateTime, default=datetime.utcnow)
    stalls = relationship("Stall", back_populates="operator", lazy="select")


class UserRead(schemas.BaseUser[uuid.UUID]):
    """Represents a read command for a user."""

    role: UserRole
    kitchen: Kitchen | None
    vendor_category: str | None
    created_at: datetime


class UserCreate(schemas.BaseUserCreate):
    """Represents a create command for a user."""

    role: UserRole = UserRole.STALL_OWNER
    kitchen: Kitchen | None = None
    stall_name: str | None = None
    vendor_category: str | None = None


class UserUpdate(schemas.BaseUserUpdate):
    """Represents an update command for a user."""

    role: UserRole | None = None
    kitchen: Kitchen | None = None
    vendor_category: str | None = None


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    """Manages a user session and its tokens."""

    reset_password_token_secret = settings.users_secret
    verification_token_secret = settings.users_secret


async def get_user_db(
    session: AsyncSession = Depends(get_db_session),
) -> SQLAlchemyUserDatabase:
    """
    Yield a SQLAlchemyUserDatabase instance.

    :param session: asynchronous SQLAlchemy session.
    :yields: instance of SQLAlchemyUserDatabase.
    """
    yield SQLAlchemyUserDatabase(session, User)


async def get_user_manager(
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
) -> UserManager:
    """
    Yield a UserManager instance.

    :param user_db: SQLAlchemy user db instance
    :yields: an instance of UserManager.
    """
    yield UserManager(user_db)


def get_jwt_strategy() -> JWTStrategy:
    """
    Return a JWTStrategy in order to instantiate it dynamically.

    :returns: instance of JWTStrategy with provided settings.
    """
    return JWTStrategy(secret=settings.users_secret, lifetime_seconds=None)


# Configure cookie transport for cross-domain authentication
# Development mode: allow HTTP, SameSite=lax
# Production mode: require HTTPS, SameSite=none for cross-domain cookies
is_dev = settings.environment == "dev"
cookie_transport = CookieTransport(
    cookie_name="fastapiusersauth",
    cookie_max_age=3600 * 24 * 7,  # 7 days
    cookie_secure=not is_dev,  # False in dev (HTTP), True in prod (HTTPS)
    cookie_httponly=True,
    cookie_samesite="lax" if is_dev else "none",  # lax for dev, none for prod
)
auth_cookie = AuthenticationBackend(
    name="cookie",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

backends = [
    auth_cookie,
]

api_users = FastAPIUsers[User, uuid.UUID](get_user_manager, backends)

current_active_user = api_users.current_user(active=True)
