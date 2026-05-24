"""Reset known accounts to known passwords."""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import update
from fastapi_users.password import PasswordHelper
from ihm_backend.db.models.users import User

ACCOUNTS = {
    "hod@fumu.com": "hod123",
    "seafood@fumu.com": "vendor123",
    "vegetables@fumu.com": "vendor123",
    "provisions@fumu.com": "vendor123",
}


async def main() -> None:
    engine = create_async_engine(
        "postgresql+asyncpg://ihm_backend:ihm_backend@localhost/admin"
    )
    helper = PasswordHelper()
    async with AsyncSession(engine) as session:
        for email, password in ACCOUNTS.items():
            hashed = helper.hash(password)
            result = await session.execute(
                update(User).where(User.email == email).values(hashed_password=hashed)
            )
            print(f"{email:30s} -> password reset ({result.rowcount} row)")
        await session.commit()
    await engine.dispose()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
