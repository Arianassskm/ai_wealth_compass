from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.schemas import prediction as schemas
from app.services import prediction_service

router = APIRouter(prefix="/predictions", tags=["predictions"])

@router.get("/initial", response_model=schemas.PredictionResponse)
async def get_initial_prediction(
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """获取初始AI预测"""
    return await prediction_service.generate_initial_prediction(db, current_user.id)

@router.post("/calibrate")
async def calibrate_prediction(
    adjustment: schemas.PredictionAdjustment,
    background_tasks: BackgroundTasks,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """校准预测结果"""
    # 立即更新基本调整
    result = await prediction_service.calibrate_prediction(
        db, current_user.id, adjustment
    )
    # 在后台进行深度分析和更新
    background_tasks.add_task(
        prediction_service.process_deep_calibration,
        db, current_user.id, adjustment
    )
    return result

@router.get("/history", response_model=List[schemas.PredictionHistory])
async def get_prediction_history(
    skip: int = 0,
    limit: int = 10,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """获取预测历史"""
    return await prediction_service.get_prediction_history(
        db, current_user.id, skip, limit
    )