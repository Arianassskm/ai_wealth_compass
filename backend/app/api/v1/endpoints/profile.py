from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.api import deps
from app.services.profile_service import ProfileService
from app.schemas.user_profile import (
    ProfileCreate,
    ProfileUpdate,
    ProfileResponse
)

# 创建路由器
router = APIRouter()

@router.post("/profile", response_model=ProfileResponse)
async def create_profile(
    profile_data: ProfileCreate,           # 请求体数据
    db: Session = Depends(deps.get_db),    # 数据库依赖
    current_user = Depends(deps.get_current_user)  # 当前用户依赖
):
    """
    创建用户画像API端点
    
    参数:
        profile_data: 用户画像创建数据
        db: 数据库会话
        current_user: 当前认证用户
        
    返回:
        ProfileResponse: 创建的用户画像
    """
    profile_service = ProfileService(db)
    return await profile_service.create_initial_profile(
        current_user.id, 
        profile_data.dict()
    )

@router.put("/profile/{profile_id}", response_model=ProfileResponse)
async def update_profile(
    profile_id: int,
    updates: ProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user)
):
    """更新用户画像"""
    profile_service = ProfileService(db)
    return await profile_service.update_profile(
        profile_id, 
        updates.dict(exclude_unset=True)
    ) 