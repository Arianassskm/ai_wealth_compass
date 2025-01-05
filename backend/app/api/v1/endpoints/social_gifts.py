from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.services.social_gift_service import SocialGiftService
from app.schemas.social_gift import (
    GiftAnalysisRequest, 
    GiftAnalysisResponse,
    GiftRecordResponse
)
from app.core.cache import get_cache
from app.utils.logger import logger

router = APIRouter()

@router.post("/analyze", response_model=GiftAnalysisResponse)
async def analyze_gift_scenario(
    request: GiftAnalysisRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user),
    cache = Depends(get_cache)
):
    """
    分析人情往来场景并提供建议
    
    - 分析当前场景
    - 提供金额/礼物建议
    - 保存分析记录
    - 后台更新统计数据
    """
    try:
        service = SocialGiftService(db, cache)
        
        # 准备分析上下文
        context = {
            "user_id": current_user.id,
            "location": f"{request.province}{request.city}",
            "event_time": request.event_time,
            "relationship": request.relationship,
            "scenario": request.scenario,
            "amount": request.amount
        }
        
        # 获取分析结果
        result = await service.analyze_gift_scenario(context)
        
        # 后台更新统计数据
        background_tasks.add_task(
            service.update_statistics,
            current_user.id,
            request.scenario
        )
        
        return GiftAnalysisResponse(**result)
        
    except Exception as e:
        logger.error(f"分析人情场景失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"分析失败: {str(e)}"
        )

@router.get("/history", response_model=List[GiftRecordResponse])
async def get_gift_history(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user)
):
    """获取用户的人情往来历史记录"""
    try:
        service = SocialGiftService(db)
        records = await service.get_user_gift_records(
            user_id=current_user.id,
            skip=skip,
            limit=limit
        )
        return records
        
    except Exception as e:
        logger.error(f"获取历史记录失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="获取历史记录失败"
        )

@router.get("/statistics/{scenario_type}")
async def get_scenario_statistics(
    scenario_type: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user),
    cache = Depends(get_cache)
):
    """获取特定场景的统计数据"""
    try:
        service = SocialGiftService(db, cache)
        stats = await service.get_scenario_statistics(
            scenario_type=scenario_type,
            user_id=current_user.id
        )
        return stats
        
    except Exception as e:
        logger.error(f"获取统计数据失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="获取统计数据失败"
        )

@router.post("/feedback/{analysis_id}")
async def submit_feedback(
    analysis_id: int,
    feedback: dict,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user)
):
    """提交用户反馈"""
    try:
        service = SocialGiftService(db)
        await service.save_user_feedback(
            analysis_id=analysis_id,
            user_id=current_user.id,
            feedback=feedback
        )
        return {"message": "反馈已保存"}
        
    except Exception as e:
        logger.error(f"保存反馈失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="保存反馈失败"
        ) 