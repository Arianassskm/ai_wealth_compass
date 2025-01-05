from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas import onboarding as schemas
from app.services import profile_service
from app.services.profile_service import ProfileService
from app.models.user.user_profile import LifeStage, FinancialStatus
from app.schemas.user_profile import OnboardingData, ProfileResponse
from app.schemas.social_gift import GiftAnalysisRequest, GiftAnalysisResponse

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

@router.post("/onboarding/complete", response_model=ProfileResponse)
async def complete_onboarding(
    onboarding_data: OnboardingData,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    完成用户引导流程,创建初始用户画像
    
    处理步骤:
    1. 验证输入数据
    2. 创建用户画像
    3. 触发AI分析
    4. 返回结果
    """
    try:
        profile_service = ProfileService(db)
        
        # 构建用户画像数据
        profile_data = {
            "user_id": current_user.id,
            "age_group": onboarding_data.age_group,
            "gender": onboarding_data.gender,
            "life_stage": onboarding_data.life_stage,
            "region_code": onboarding_data.region_code,
            "financial_status": onboarding_data.financial_status,
            "housing_status": onboarding_data.housing_status,
            "employment_status": onboarding_data.employment_status,
            "lifestyle_status": onboarding_data.lifestyle_status,
            "short_term_goal": onboarding_data.short_term_goal,
            "mid_term_goal": onboarding_data.mid_term_goal,
            "long_term_goal": onboarding_data.long_term_goal,
            "preferences": onboarding_data.preferences,
            "risk_tolerance": onboarding_data.risk_tolerance
        }
        
        # 创建初始画像
        profile = await profile_service.create_initial_profile(
            current_user.id,
            profile_data
        )
        
        # 更新完成度
        profile.update_completion_rate()
        
        return profile
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"创建用户画像失败: {str(e)}"
        )