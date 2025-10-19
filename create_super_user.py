"""Script to create a superuser for the application."""

import asyncio
import getpass

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from ihm_backend.db.models.users import User, UserRole, get_user_manager
from ihm_backend.settings import settings


async def create_superuser() -> None:
    """Create a superuser in the database."""
    # Create async engine and session
    engine = create_async_engine(str(settings.db_url), echo=False)
    async_session_maker = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    # Get user input
    print("=== Create Superuser ===")
    email = input("Email: ").strip()
    password = getpass.getpass("Password: ")
    password_confirm = getpass.getpass("Confirm password: ")

    if password != password_confirm:
        print("Error: Passwords do not match!")
        return

    if not email or not password:
        print("Error: Email and password are required!")
        return

    try:
        async with async_session_maker() as session:
            # Check if user already exists
            from sqlalchemy import select

            result = await session.execute(select(User).where(User.email == email))
            existing_user = result.scalar_one_or_none()

            if existing_user:
                print(f"Error: User with email {email} already exists!")
                return

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
            from fastapi_users.db import SQLAlchemyUserDatabase

            user_db = SQLAlchemyUserDatabase(session, User)

            # Get user manager and create user with hashed password
            async for user_manager in get_user_manager(user_db):
                # Hash the password and create user
                user.hashed_password = user_manager.password_helper.hash(password)
                session.add(user)
                await session.commit()
                await session.refresh(user)

                print(f"\n✓ Superuser created successfully!")
                print(f"  Email: {user.email}")
                print(f"  Role: {user.role.value}")
                print(f"  ID: {user.id}")
                break

    except Exception as e:
        print(f"Error creating superuser: {e}")
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(create_superuser())
