from importlib import metadata

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import UJSONResponse

from ihm_backend.settings import settings
from ihm_backend.web.api.router import api_router
from ihm_backend.web.lifespan import lifespan_setup


def get_app() -> FastAPI:
    """
    Get FastAPI application.

    This is the main constructor of an application.

    :return: application.
    """
    app = FastAPI(
        title="ihm_backend",
        version=metadata.version("ihm_backend"),
        lifespan=lifespan_setup,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        default_response_class=UJSONResponse,
    )

    # Add CORS middleware
    # Parse origins from comma-separated string
    origins = [origin.strip() for origin in settings.cors_origins.split(",")]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Main router for the API.
    app.include_router(router=api_router, prefix="/api")

    return app
