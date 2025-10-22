import uuid
from fastapi import APIRouter, Depends

from ihm_backend.db.models.users import (  # type: ignore
    UserCreate,
    UserRead,
    UserUpdate,
    api_users,
    auth_cookie,
    UserRole,
    get_user_manager
)
from ihm_backend.db.models.stall import Stall
from ihm_backend.web.dependencies.auth import require_role
from sqlalchemy.ext.asyncio import AsyncSession
from ihm_backend.db.dependencies import get_db_session

router = APIRouter()

@router.post(
    "/auth/register",
    response_model = UserRead,
    dependencies=[Depends(require_role(UserRole.ADMIN))],
    tags=[ "auth" ])
async def register_user(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_db_session),
    user_manager = Depends(get_user_manager)):
    stall_name = user_data.stall_name
    user_create_dict = user_data.model_dump(exclude={"stall_name"})
    user = await user_manager.create(UserCreate(**user_create_dict), safe=True, request=None)

    # Create stall if user is STALL_OWNER and stall_name is provided
    if user.role == UserRole.STALL_OWNER and stall_name:
        stall = Stall(
            id=uuid.uuid4(),
            stall_name=stall_name,
            operator_id=user.id
        )
        session.add(stall)
        await session.commit()

    return UserRead.model_validate(user)



router.include_router(
    api_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
router.include_router(
    api_users.get_auth_router(auth_cookie),
    prefix="/auth/cookie",
    tags=["auth"],
)
