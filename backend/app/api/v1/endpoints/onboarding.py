from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas import onboarding as schemas
from app.services import profile_service

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

@router.post("/basic-info", response_model=schemas.UserProfileResponse)
async def create_basic_info(
    user_info: schemas.UserBasicInfo,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """第一步：创建用户基本信息"""
    return await profile_service.create_basic_info(db, current_user.id, user_info)

@router.post("/life-stage", response_model=schemas.UserProfileResponse)
async def update_life_stage(
    life_stage: schemas.LifeStageUpdate,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """第二步：更新生命阶段"""
    return await profile_service.update_life_stage(db, current_user.id, life_stage)

@router.post("/lifestyle", response_model=schemas.UserProfileResponse)
async def update_lifestyle(
    lifestyle: schemas.LifestyleInfo,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """第三步：更新生活方式信息"""
    return await profile_service.update_lifestyle(db, current_user.id, lifestyle)

@router.post("/goals", response_model=schemas.UserProfileResponse)
async def set_life_goals(
    goals: schemas.LifeGoals,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """第四步：设置人生目标"""
    return await profile_service.set_life_goals(db, current_user.id, goals)

@router.get("/status", response_model=schemas.OnboardingStatus)
async def get_onboarding_status(
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """获取用户引导完成状态"""
    return await profile_service.get_onboarding_status(db, current_user.id)