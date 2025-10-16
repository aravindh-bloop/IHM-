from fastapi.routing import APIRouter

from ihm_backend.web.api import echo, monitoring, redis, stall, users

api_router = APIRouter()
api_router.include_router(monitoring.router)
api_router.include_router(users.router)
api_router.include_router(echo.router, prefix="/echo", tags=["echo"])
api_router.include_router(redis.router, prefix="/redis", tags=["redis"])
api_router.include_router(stall.router, prefix="/stall", tags=["stall"])
