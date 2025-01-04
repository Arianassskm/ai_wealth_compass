from sqlalchemy import Column, Integer, Float, String, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class PortfolioStrategy(str, enum.Enum):
    CONSERVATIVE = "conservative"
    BALANCED = "balanced"
    GROWTH = "growth"
    AGGRESSIVE = "aggressive"
    CUSTOM = "custom"

class Portfolio(BaseModel):
    __tablename__ = "portfolios"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    risk_assessment_id = Column(Integer, ForeignKey("risk_assessments.id"))
    lifecycle_id = Column(Integer, ForeignKey("lifecycle_models.id"))
    
    # 基本信息
    name = Column(String(100))
    strategy = Column(SQLEnum(PortfolioStrategy))
    description = Column(String(500))
    
    # 投资配置
    target_allocation = Column(JSON)  # 目标资产配置
    current_allocation = Column(JSON) # 当前资产配置
    rebalance_threshold = Column(Float)  # 再平衡阈值
    
    # AI生成的建议
    recommended_allocation = Column(JSON)
    allocation_rationale = Column(JSON)
    confidence_score = Column(Float)
    
    # 绩效指标
    total_value = Column(Float)
    total_return = Column(Float)
    risk_metrics = Column(JSON)  # 风险指标
    performance_metrics = Column(JSON)  # 绩效指标
    
    # 投资约束
    constraints = Column(JSON)  # 投资限制条件
    preferences = Column(JSON)  # 投资偏好
    
    # 关系
    user = relationship("User", back_populates="portfolios")
    risk_assessment = relationship("RiskAssessment", back_populates="portfolios")
    lifecycle_model = relationship("LifecycleModel", back_populates="portfolios")
    assets = relationship("Asset", back_populates="portfolio")
    transactions = relationship("InvestmentTransaction", back_populates="portfolio")

    def calculate_portfolio_metrics(self):
        """计算投资组合指标"""
        if not self.assets:
            return None
            
        metrics = {
            'total_value': sum(asset.current_value for asset in self.assets),
            'weighted_return': sum(
                asset.current_value * asset.return_rate 
                for asset in self.assets if asset.current_value
            ),
            'asset_distribution': {
                asset.asset_type: asset.current_value 
                for asset in self.assets
            }
        }
        
        self.update_risk_metrics()
        return metrics

    def check_rebalance_needed(self):
        """检查是否需要再平衡"""
        if not (self.target_allocation and self.current_allocation):
            return False
            
        for asset_type in self.target_allocation:
            target = self.target_allocation[asset_type]
            current = self.current_allocation.get(asset_type, 0)
            if abs(target - current) > self.rebalance_threshold:
                return True
        return False