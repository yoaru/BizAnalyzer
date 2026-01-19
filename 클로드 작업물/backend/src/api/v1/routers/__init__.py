from .auth_router import router as auth_router
from .ideas_router import router as ideas_router
from .reports_router import router as reports_router
from .search_router import router as search_router

__all__ = [
    "auth_router",
    "ideas_router",
    "reports_router",
    "search_router"
]
