from ihm_backend.settings import Settings


def test_db_admin_url_uses_postgres_db_for_admin_connections() -> None:
    settings = Settings(
        db_url_string="postgresql+asyncpg://user:pass@host:5432/ihm_backend",
    )

    assert str(settings.db_admin_url) == "postgresql+asyncpg://user:pass@host:5432/postgres"


def test_cors_origins_parses_comma_separated_frontend_urls() -> None:
    settings = Settings(
        cors_origins="https://app.vercel.app,https://admin.vercel.app,http://localhost:5173",
    )

    assert settings.cors_origins_list == [
        "https://app.vercel.app",
        "https://admin.vercel.app",
        "http://localhost:5173",
    ]
