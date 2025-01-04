from sqlalchemy import Column, Integer, Float, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel

class AICalibration(BaseModel):
    __tablename__ = "ai_calibrations"
    
    prediction_id = Column(Integer, ForeignKey("ai_predictions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # 校准数据
    original_values = Column(JSON)  # 原始预测值
    calibrated_values = Column(JSON)  # 校准后的值
    calibration_factors = Column(JSON)  # 校准因子
    
    # 校准指标
    calibration_score = Column(Float)  # 校准效果得分
    impact_metrics = Column(JSON)  # 影响指标
    confidence_delta = Column(Float)  # 置信度变化
    
    # 校准历史
    calibration_history = Column(JSON)  # 历史校准记录
    calibration_date = Column(DateTime)
    
    # 分析数据
    performance_improvement = Column(JSON)  # 性能提升指标
    learning_metrics = Column(JSON)  # 学习指标
    
    # 关系
    prediction = relationship("AIPrediction", back_populates="calibrations")
    user = relationship("User", back_populates="calibrations")

    def apply_calibration(self):
        """应用校准"""
        if not (self.original_values and self.calibration_factors):
            return None
            
        calibrated = {}
        for category, value in self.original_values.items():
            factor = self.calibration_factors.get(category, 1.0)
            calibrated[category] = value * factor
            
        self.calibrated_values = calibrated
        self._update_calibration_score()
        return calibrated

    def analyze_calibration_impact(self):
        """分析校准影响"""
        if not (self.original_values and self.calibrated_values):
            return None
            
        impact = {
            'value_changes': {},
            'percentage_changes': {},
            'significance_scores': {}
        }
        
        for category in self.original_values:
            original = self.original_values[category]
            calibrated = self.calibrated_values.get(category, original)
            
            if original != 0:
                change = calibrated - original
                change_percentage = (change / original) * 100
                
                impact['value_changes'][category] = change
                impact['percentage_changes'][category] = change_percentage
                
        self.impact_metrics = impact
        return impact