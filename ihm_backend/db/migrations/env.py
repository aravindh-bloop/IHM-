import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.ext.asyncio.engine import create_async_engine
from sqlalchemy.future import Connection
from ihm_backend.db.meta import meta
from ihm_backend.db.models import load_all_models
from ihm_backend.settings import settings

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config


load_all_models()
# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = meta

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


async def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    db_url = str(settings.db_url)
    
    # Validate asyncpg usage
    if "postgresql+asyncpg://" not in db_url and "postgres+asyncpg://" not in db_url:
        raise ValueError(
            f"Migrations require asyncpg driver. "
            f"Database URL must use 'postgresql+asyncpg://' "
            f"but got: {db_url[:50]}..."
        )
    
    context.configure(
        url=db_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """
    Run actual sync migrations.

    :param connection: connection to the database.
    """
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    db_url = str(settings.db_url)
    
    # Validate asyncpg usage
    if "postgresql+asyncpg://" not in db_url and "postgres+asyncpg://" not in db_url:
        raise ValueError(
            f"Migrations require asyncpg driver. "
            f"Database URL must use 'postgresql+asyncpg://' "
            f"but got: {db_url[:50]}..."
        )
    
    # Setup connect_args
    connect_args = {"statement_cache_size": 0}  # Disable prepared statements for pgbouncer
    
    # Enable SSL for cloud databases (Neon, Heroku, etc.)
    cloud_hosts = ['neon.tech', 'heroku.com', 'supabase.co', 'amazonaws.com', 'google.com']
    if any(host in db_url for host in cloud_hosts):
        connect_args["ssl"] = True
    
    connectable = create_async_engine(
        db_url,
        connect_args=connect_args,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)


loop = asyncio.get_event_loop()
if context.is_offline_mode():
    task = run_migrations_offline()
else:
    task = run_migrations_online()

loop.run_until_complete(task)
