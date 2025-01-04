from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from app.api import deps
from app.schemas import financial as schemas
from app.services import financial_service

router = APIRouter(prefix="/financial", tags=["financial"])

# 预算管理路由
@router.post("/budgets", response_model=schemas.BudgetResponse)
async def create_budget(
    budget: schemas.BudgetCreate,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """创建预算计划"""
    return await financial_service.create_budget(db, current_user.id, budget)

@router.get("/budgets/current", response_model=schemas.BudgetResponse)
async def get_current_budget(
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """获取当前预算"""
    return await financial_service.get_current_budget(db, current_user.id)

@router.get("/budgets/analysis", response_model=schemas.BudgetAnalysis)
async def get_budget_analysis(
    start_date: date,
    end_date: date,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """获取预算分析"""
    return await financial_service.analyze_budget(
        db, current_user.id, start_date, end_date
    )

# 交易记录路由
@router.post("/transactions", response_model=schemas.TransactionResponse)
async def create_transaction(
    transaction: schemas.TransactionCreate,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """记录新交易"""
    return await financial_service.create_transaction(
        db, current_user.id, transaction
    )

@router.get("/transactions", response_model=List[schemas.TransactionResponse])
async def get_transactions(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """获取交易记录"""
    return await financial_service.get_transactions(
        db, current_user.id, start_date, end_date, category, skip, limit
    )