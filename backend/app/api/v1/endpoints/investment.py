from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.api import deps
from app.schemas import investment as schemas
from app.services import investment_service

router = APIRouter(prefix="/investment", tags=["investment"])

@router.post("/portfolio", response_model=schemas.PortfolioResponse)
async def create_portfolio(
    portfolio: schemas.PortfolioCreate,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """创建投资组合"""
    return await investment_service.create_portfolio(db, current_user.id, portfolio)

@router.get("/portfolio/current", response_model=schemas.PortfolioResponse)
async def get_current_portfolio(
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """获取当前投资组合"""
    return await investment_service.get_current_portfolio(db, current_user.id)

@router.post("/portfolio/adjust", response_model=schemas.PortfolioResponse)
async def adjust_portfolio(
    adjustment: schemas.PortfolioAdjustment,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """调整投资组合"""
    return await investment_service.adjust_portfolio(
        db, current_user.id, adjustment
    )

@router.get("/analysis", response_model=schemas.InvestmentAnalysis)
async def get_investment_analysis(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """获取投资分析"""
    return await investment_service.analyze_investments(
        db, current_user.id, start_date, end_date
    )

@router.get("/recommendations", response_model=List[schemas.InvestmentRecommendation])
async def get_investment_recommendations(
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """获取投资建议"""
    return await investment_service.get_recommendations(db, current_user.id)