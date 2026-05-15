import enum
import os
from pathlib import Path
from tempfile import gettempdir
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict
from yarl import URL

TEMP_DIR = Path(gettempdir())


class LogLevel(str, enum.Enum):
    """Possible log levels."""

    NOTSET = "NOTSET"
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    FATAL = "FATAL"


class Settings(BaseSettings):
    """
    Application settings.

    These parameters can be configured
    with environment variables.
    """

    host: str = "0.0.0.0"
    port: int = 8000
    # quantity of workers for uvicorn
    workers_count: int = 1
    # Enable uvicorn reloading
    reload: bool = False

    # Current environment
    environment: str = "dev"

    log_level: LogLevel = LogLevel.INFO
    users_secret: str = ""
    # Super User settings
    super_user: Optional[str] = None
    super_user_pass: Optional[str] = None
    # Variables for the database
    # Either use individual parts OR db_url (connection string takes precedence)
    db_url_string: Optional[str] = None
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "ihm_backend"
    db_pass: str = "ihm_backend"
    db_base: str = "admin"
    db_echo: bool = False

    # Variables for Redis
    # Either use individual parts OR redis_url_string (connection string takes precedence)
    redis_url_string: Optional[str] = None
    redis_host: str = "ihm_backend-redis"
    redis_port: int = 6379
    redis_user: Optional[str] = None
    redis_pass: Optional[str] = None
    redis_base: Optional[int] = None

    # Email settings
    mail_username: str = "your-email@gmail.com"
    mail_password: str = "your-app-password"
    mail_from: str = "your-email@gmail.com"
    mail_port: int = 587
    mail_server: str = "smtp.gmail.com"
    mail_from_name: str = "FUMU - Food Management System"
    mail_starttls: bool = True
    mail_ssl_tls: bool = False
    admin_email: str = "admin@admin.com"  # Admin email to receive notifications

    # CORS settings
    cors_origins: str = "*"  # Comma-separated list of allowed origins

    @property
    def db_url(self) -> URL:
        """
        Assemble database URL from settings.

        Supports two modes:
        1. Connection string: IHM_BACKEND_DB_URL_STRING (takes precedence)
        2. Individual parts: IHM_BACKEND_DB_* (fallback)

        Connection string MUST use asyncpg driver: postgresql+asyncpg://

        :return: database URL.
        :raises ValueError: if connection string doesn't use asyncpg driver
        """
        if self.db_url_string:
            url = URL(self.db_url_string)
            # Ensure we're using asyncpg driver
            if url.scheme not in ("postgresql+asyncpg", "postgres+asyncpg"):
                raise ValueError(
                    f"Database URL must use asyncpg driver. "
                    f"Expected 'postgresql+asyncpg://' but got '{url.scheme}://'. "
                    f"Update IHM_BACKEND_DB_URL_STRING to use postgresql+asyncpg://"
                )
            return url
        
        return URL.build(
            scheme="postgresql+asyncpg",
            host=self.db_host,
            port=self.db_port,
            user=self.db_user,
            password=self.db_pass,
            path=f"/{self.db_base}",
        )

    @property
    def redis_url(self) -> URL:
        """
        Assemble REDIS URL from settings.

        Supports two modes:
        1. Connection string: IHM_BACKEND_REDIS_URL_STRING (takes precedence)
        2. Individual parts: IHM_BACKEND_REDIS_* (fallback)

        :return: redis URL.
        """
        if self.redis_url_string:
            return URL(self.redis_url_string)
        
        path = ""
        if self.redis_base is not None:
            path = f"/{self.redis_base}"
        return URL.build(
            scheme="redis",
            host=self.redis_host,
            port=self.redis_port,
            user=self.redis_user,
            password=self.redis_pass,
            path=path,
        )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="IHM_BACKEND_",
        env_file_encoding="utf-8",
    )


settings = Settings()
