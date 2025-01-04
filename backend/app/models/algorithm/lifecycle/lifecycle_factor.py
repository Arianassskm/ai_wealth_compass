from sqlalchemy import Column, Integer, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ...base.base_model import BaseModel

class LifecycleFactor(BaseModel):
    __tablename__ = "lifecycle_factors"
    
    lifecycle_model_id = Column(Integer, ForeignKey("lifecycle_models.id"))
    user_profile_id = Column(Integer, ForeignKey("user_profiles.id"))
    
    # 收入因子
    income_growth_rate = Column(Float)
    income_stability = Column(Float)
    career_potential = Column(Float)
    
    # 支出因子
    expense_pattern = Column(JSON)
    lifestyle_coefficient = Column(Float)
    dependency_ratio = Column(Float)
    
    # 财富积累因子
    saving_capacity = Column(Float)
    investment_preference = Column(Float)
    wealth_momentum = Column(Float)
    
    # 动态调整参数
    adjustment_history = Column(JSON)
    factor_confidence = Column(Float)
    
    # 关系
    lifecycle_model = relationship("LifecycleModel", back_populates="factors")
    profile = relationship("UserProfile", back_populates="lifecycle_factors")

    def calculate_composite_score(self):
        """计算综合生命周期得分"""
        if all([self.income_stability, self.saving_capacity, self.wealth_momentum]):
            return (
                self.income_stability * 0.4 +
                self.saving_capacity * 0.3 +
                self.wealth_momentum * 0.3
            )
        return None