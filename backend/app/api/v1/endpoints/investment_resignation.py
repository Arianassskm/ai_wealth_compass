"""投资/辞职分析API端点"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.schemas.investment_resignation import (
    InvestmentResignationRequest,
    InvestmentResignationResponse
)
from app.services.ai.investment_resignation_analyzer import InvestmentResignationAnalyzer
from app.models.analysis.investment_resignation import InvestmentResignationAnalysis
from app.utils.logger import logger

router = APIRouter()

@router.post("/analyze", response_model=InvestmentResignationResponse)
async def analyze_investment_resignation(
    request: InvestmentResignationRequest,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """分析投资/辞职决策"""
    try:
        # 创建分析器实例
        analyzer = InvestmentResignationAnalyzer()
        
        # 准备分析上下文
        context = {
            "user_id": current_user.id,
            "decision_type": request.decision_type,
            "amount": request.amount,
            "timeframe": request.timeframe,
            "current_savings": request.current_savings,
            "investment_type": request.investment_type,
            "resignation_reason": request.resignation_reason
        }
        
        # 获取分析结果
        analysis_result = await analyzer.analyze(context)
        
        # 创建分析记录
        analysis = InvestmentResignationAnalysis(
            user_id=current_user.id,
            decision_type=request.decision_type,
            amount=request.amount,
            timeframe=request.timeframe,
            current_savings=request.current_savings,
            investment_type=request.investment_type,
            resignation_reason=request.resignation_reason,
            analysis_result=analysis_result['analysis_result'],
            risk_assessment=analysis_result['risk_assessment'],
            recommendations=analysis_result['recommendations'],
            opportunities=analysis_result['opportunities'],
            challenges=analysis_result['challenges']
        )
        
        # 保存到数据库
        db.add(analysis)
        await db.commit()
        await db.refresh(analysis)
        
        return analysis
        
    except Exception as e:
        logger.error(f"分析失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"分析失败: {str(e)}"
        )

@router.get("/history", response_model=List[InvestmentResignationResponse])
async def get_analysis_history(
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """获取分析历史"""
    try:
        analyses = await db.query(InvestmentResignationAnalysis)\
            .filter(InvestmentResignationAnalysis.user_id == current_user.id)\
            .order_by(InvestmentResignationAnalysis.created_at.desc())\
            .all()
        return analyses
        
    except Exception as e:
        logger.error(f"获取历史记录失败: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="获取历史记录失败"
        ) 