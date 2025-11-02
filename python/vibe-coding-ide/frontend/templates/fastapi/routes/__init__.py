from fastapi import APIRouter
from .items import router as items_router
from .users import router as users_router


api_router = APIRouter(prefix="/api")
api_router.include_router(items_router, prefix="/items", tags=["items"])
api_router.include_router(users_router, prefix="/users", tags=["users"])


@api_router.get('/health')
def health():
    return { 'status': 'ok' }

@api_router.get('/ping')
def ping():
    return { 'message': 'pong' }

