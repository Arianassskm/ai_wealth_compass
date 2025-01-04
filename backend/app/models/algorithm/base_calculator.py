from sqlalchemy import Column, Integer, Float, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel

class FinancialBaseCalculator(BaseModel):
    __tablename__ = "financial_base_calculations"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    region_code = Column(String(50))
    
    # 基础生活成本计算
    base_living_cost = Column(Float)
    housing_index = Column(Float)
    consumption_index = Column(Float)
    
    # 收入能力评估
    income_potential = Column(Float)
    career_growth_rate = Column(Float)
    
    # 地区经济指标
    regional_factors = Column(JSON)  # 存储地区特定的经济指标
    
    # 计算结果
    monthly_base_expenses = Column(Float)
    yearly_growth_projection = Column(Float)
    
    # 元数据
    calculation_parameters = Column(JSON)  # 存储计算使用的参数
    data_sources = Column(JSON)  # 数据来源追踪
    last_update = Column(DateTime)
    
    # 关系
    user = relationship("User", back_populates="base_calculations")
    hybrid_predictions = relationship("HybridPredictionManager", back_populates="base_calculator")

    def calculate_living_cost(self):
        """计算基础生活成本"""
        if all([self.base_living_cost, self.housing_index, self.consumption_index]):
            return self.base_living_cost * (self.housing_index + self.consumption_index)
        return None

    def project_income_growth(self, years: int):
        """预测收入增长"""
        if self.income_potential and self.career_growth_rate:
            return self.income_potential * (1 + self.career_growth_rate) ** years
        return None