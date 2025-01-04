from sqlalchemy import Column, Integer, Float, String, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ...base.base_model import BaseModel
import enum

class LifecycleStage(str, enum.Enum):
    EDUCATION = "education"
    CAREER_START = "career_start"
    FAMILY_BUILDING = "family_building"
    CAREER_PEAK = "career_peak"
    PRE_RETIREMENT = "pre_retirement"
    RETIREMENT = "retirement"

class LifecycleModel(BaseModel):
    __tablename__ = "lifecycle_models"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    current_stage = Column(SQLEnum(LifecycleStage))
    
    # 生命周期特征
    age_factor = Column(Float)
    career_factor = Column(Float)
    family_factor = Column(Float)
    wealth_factor = Column(Float)
    
    # 阶段特定目标
    stage_goals = Column(JSON)  # 每个阶段的财务目标
    stage_progress = Column(Float)  # 当前阶段完成度
    
    # 转换预测
    next_stage_prediction = Column(String(50))
    stage_transition_probability = Column(Float)
    
    # 模型参数
    model_parameters = Column(JSON)
    adjustment_factors = Column(JSON)
    
    # 关系
    user = relationship("User", back_populates="lifecycle_model")
    factors = relationship("LifecycleFactor", back_populates="lifecycle_model")

    def calculate_stage_weights(self):
        """计算当前生命周期阶段的各项权重"""
        weights = {
            'income_weight': 0.0,
            'expense_weight': 0.0,
            'investment_weight': 0.0,
            'risk_weight': 0.0
        }
        
        if self.current_stage and self.model_parameters:
            stage_params = self.model_parameters.get(self.current_stage, {})
            weights = {
                'income_weight': stage_params.get('income', 0.0) * self.career_factor,
                'expense_weight': stage_params.get('expense', 0.0) * self.family_factor,
                'investment_weight': stage_params.get('investment', 0.0) * self.wealth_factor,
                'risk_weight': stage_params.get('risk', 0.0) * self.age_factor
            }
        
        return weights