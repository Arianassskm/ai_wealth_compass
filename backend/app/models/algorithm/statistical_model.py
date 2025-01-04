from sqlalchemy import Column, Integer, Float, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel

class StatisticalReference(BaseModel):
    __tablename__ = "statistical_references"
    
    # 分类标识
    age_group = Column(String(20))
    life_stage = Column(String(50))
    region_code = Column(String(50))
    
    # 收入统计
    mean_income = Column(Float)
    median_income = Column(Float)
    income_std_dev = Column(Float)
    income_percentiles = Column(JSON)  # 存储不同百分位的收入数据
    
    # 支出比例
    expense_ratios = Column(JSON)  # 各类支出占比
    saving_ratios = Column(JSON)  # 储蓄投资占比
    
    # 行业特征
    industry_factors = Column(JSON)
    career_progression = Column(JSON)
    
    # 统计元数据
    sample_size = Column(Integer)
    confidence_level = Column(Float)
    last_update = Column(DateTime)
    data_quality_score = Column(Float)
    
    # 关系
    hybrid_predictions = relationship("HybridPredictionManager", back_populates="statistical_reference")

    def get_income_range(self, confidence_interval: float = 0.95):
        """计算收入范围"""
        if all([self.mean_income, self.income_std_dev]):
            z_score = 1.96  # 95% 置信区间
            margin = z_score * self.income_std_dev
            return {
                'lower_bound': self.mean_income - margin,
                'upper_bound': self.mean_income + margin
            }
        return None