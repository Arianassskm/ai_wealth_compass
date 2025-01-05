"""投资/辞职分析模型"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from app.models.base import BaseModel

class InvestmentResignationAnalysis(BaseModel):
    """投资/辞职分析记录"""
    __tablename__ = "investment_resignation_analyses"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    decision_type = Column(String(50))  # investment 或 resignation
    
    # 基础信息
    amount = Column(Integer)  # 涉及金额
    timeframe = Column(String(50))  # 时间框架
    current_savings = Column(Integer)  # 当前储蓄
    
    # 具体信息
    investment_type = Column(String(50), nullable=True)  # 投资类型
    resignation_reason = Column(String(50), nullable=True)  # 辞职原因
    
    # AI分析结果
    analysis_result = Column(JSON)  # 分析结果
    risk_assessment = Column(JSON)  # 风险评估
    recommendations = Column(JSON)  # 建议
    opportunities = Column(JSON)  # 机会
    challenges = Column(JSON)  # 挑战
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 