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

    This function creates SQLAlchemy async engine instance,
    session_factory for creating sessions
    and stores them in the application's state property.

    Uses connection string from settings which MUST use asyncpg driver.

    :param app: fastAPI application.
    :raises ValueError: if connection string doesn't use asyncpg driver
    """
    try:
        db_url = str(settings.db_url)
        
        # Validate that we're using asyncpg
        if "postgresql+asyncpg://" not in db_url and "postgres+asyncpg://" not in db_url:
            raise ValueError(
                f"Invalid database URL scheme. Must use 'postgresql+asyncpg://' "
                f"but got: {db_url[:50]}..."
            )
        
        # Setup connect_args
        connect_args = {"statement_cache_size": 0}  # Disable prepared statements for pgbouncer
        
        # Enable SSL for cloud databases (Neon, Heroku, etc.)
        # Detect common cloud database hosts that require SSL
        cloud_hosts = ['neon.tech', 'heroku.com', 'supabase.co', 'amazonaws.com', 'google.com']
        if any(host in db_url for host in cloud_hosts):
            connect_args["ssl"] = True
        
        engine = create_async_engine(
            db_url,
            echo=settings.db_echo,
            connect_args=connect_args,
        )
        session_factory = async_sessionmaker(
            engine,
            expire_on_commit=False,
        )
        app.state.db_engine = engine
        app.state.db_session_factory = session_factory
    except ValueError as e:
        raise ValueError(f"Database configuration error: {str(e)}") from e
    except Exception as e:
        raise RuntimeError(
            f"Failed to initialize database engine. "
            f"Check your IHM_BACKEND_DB_URL_STRING or individual DB_* settings. "
            f"Error: {str(e)}"
        ) from e


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
