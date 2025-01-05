"""投资/辞职分析的数据模型"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class InvestmentResignationRequest(BaseModel):
    """投资/辞职分析请求"""
    decision_type: str = Field(..., description="决策类型: investment或resignation")
    amount: int = Field(..., description="涉及金额")
    timeframe: str = Field(..., description="时间框架")
    current_savings: int = Field(..., description="当前储蓄")
    investment_type: Optional[str] = Field(None, description="投资类型")
    resignation_reason: Optional[str] = Field(None, description="辞职原因")

class RiskAssessment(BaseModel):
    """风险评估"""
    level: str = Field(..., description="风险等级")
    factors: List[str] = Field(..., description="风险因素")
    mitigation: List[str] = Field(..., description="风险缓解建议")

class AnalysisResult(BaseModel):
    """分析结果"""
    feasibility_score: int = Field(..., description="可行性评分(0-100)")
    key_findings: List[str] = Field(..., description="主要发现")
    swot_analysis: Dict[str, List[str]] = Field(..., description="SWOT分析")

class InvestmentResignationResponse(BaseModel):
    """投资/辞职分析响应"""
    id: int
    decision_type: str
    analysis_result: AnalysisResult
    risk_assessment: RiskAssessment
    recommendations: List[str]
    opportunities: List[str]
    challenges: List[str]
    created_at: datetime

    class Config:
        from_attributes = True 