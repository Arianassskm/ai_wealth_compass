"""API路由注册"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    investment_resignation
)

api_router = APIRouter()

# 注册各模块路由
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(
    investment_resignation.router,
    prefix="/investment-resignation",
    tags=["investment-resignation"]
) 