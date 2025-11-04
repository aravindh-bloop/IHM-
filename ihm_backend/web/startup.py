"""Startup utilities for creating initial users."""
import logging
from typing import Optional

from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ihm_backend.db.models.users import User, UserRole, get_user_manager
from ihm_backend.settings import settings

logger = logging.getLogger(__name__)


async def create_superuser_from_env(session: AsyncSession) -> Optional[User]:
    """
    Create superuser from environment variables if it doesn't exist.
    
    :param session: Database session
    :return: Created or existing superuser, or None if credentials not provided
    """
    if not settings.super_user or not settings.super_user_pass:
        logger.warning(
            "SUPER_USER or SUPER_USER_PASS not set in environment. "
            "Skipping superuser creation."
        )
        return None

    email = settings.super_user
    password = settings.super_user_pass

    try:
        # Check if user already exists
        result = await session.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            logger.info(f"Superuser '{email}' already exists. Skipping creation.")
            return existing_user

        # Create the superuser
        user = User(
            email=email,
            hashed_password="",  # Will be set by user manager
            is_active=True,
            is_superuser=True,
            is_verified=True,
            role=UserRole.ADMIN,
        )

        # Use SQLAlchemyUserDatabase to manage the user
        user_db = SQLAlchemyUserDatabase(session, User)

        # Get user manager and create user with hashed password
        async for user_manager in get_user_manager(user_db):
            # Hash the password and create user
            user.hashed_password = user_manager.password_helper.hash(password)
            session.add(user)
            await session.commit()
            await session.refresh(user)

            logger.info(
                f"✓ Superuser created successfully: {user.email} (Role: {user.role.value})"
            )
            return user

    except Exception as e:
        logger.error(f"Error creating superuser: {e}")
        await session.rollback()
        return None

    return None
