from sqlalchemy import Column, Integer, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ...base.base_model import BaseModel

class RiskFactor(BaseModel):
    __tablename__ = "risk_factors"
    
    risk_assessment_id = Column(Integer, ForeignKey("risk_assessments.id"))
    
    # 收入风险因子
    income_source_diversity = Column(Float)
    income_stability_index = Column(Float)
    career_risk_factor = Column(Float)
    
    # 支出风险因子
    expense_volatility = Column(Float)
    fixed_expense_ratio = Column(Float)
    emergency_fund_ratio = Column(Float)
    
    # 投资风险因子
    portfolio_volatility = Column(Float)
    market_correlation = Column(Float)
    diversification_score = Column(Float)
    
    # 生命事件风险
    life_event_probability = Column(JSON)
    insurance_coverage_ratio = Column(Float)
    
    # 风险因子历史
    factor_history = Column(JSON)
    trend_analysis = Column(JSON)
    
    # 关系
    assessment = relationship("RiskAssessment", back_populates="risk_factors")

    def calculate_risk_metrics(self):
        """计算综合风险指标"""
        metrics = {}
        
        if all([self.income_source_diversity, self.income_stability_index, self.career_risk_factor]):
            metrics['income_risk'] = (
                self.income_source_diversity * 0.3 +
                self.income_stability_index * 0.4 +
                self.career_risk_factor * 0.3
            )
            
        if all([self.portfolio_volatility, self.market_correlation, self.diversification_score]):
            metrics['investment_risk'] = (
                self.portfolio_volatility * 0.4 +
                self.market_correlation * 0.3 +
                self.diversification_score * 0.3
            )
            
        return metrics if metrics else None