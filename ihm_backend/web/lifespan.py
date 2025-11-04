from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from ihm_backend.services.redis.lifespan import init_redis, shutdown_redis
from ihm_backend.settings import settings
from ihm_backend.tkq import broker
from ihm_backend.web.startup import create_superuser_from_env


def _setup_db(app: FastAPI) -> None:  # pragma: no cover
    """
    Creates connection to the database.

    This function creates SQLAlchemy engine instance,
    session_factory for creating sessions
    and stores them in the application's state property.

    :param app: fastAPI application.
    """
    engine = create_async_engine(str(settings.db_url), echo=settings.db_echo)
    session_factory = async_sessionmaker(
        engine,
        expire_on_commit=False,
    )
    app.state.db_engine = engine
    app.state.db_session_factory = session_factory


async def _create_initial_data(app: FastAPI) -> None:  # pragma: no cover
    """
    Create initial data like superuser on startup.
    
    :param app: fastAPI application.
    """
    async with app.state.db_session_factory() as session:
        await create_superuser_from_env(session)


@asynccontextmanager
async def lifespan_setup(
    app: FastAPI,
) -> AsyncGenerator[None, None]:  # pragma: no cover
    """
    Actions to run on application startup.

    This function uses fastAPI app to store data
    in the state, such as db_engine.

    :param app: the fastAPI application.
    :return: function that actually performs actions.
    """

    app.middleware_stack = None
    if not broker.is_worker_process:
        await broker.startup()
    _setup_db(app)
    init_redis(app)
    
    # Create initial data (superuser from env)
    await _create_initial_data(app)
    
    app.middleware_stack = app.build_middleware_stack()

    yield
    if not broker.is_worker_process:
        await broker.shutdown()
    await app.state.db_engine.dispose()

    await shutdown_redis(app)
