from sqlalchemy import Column, Integer, Float, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class PredictionStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class HybridPredictionManager(BaseModel):
    __tablename__ = "hybrid_predictions"
    
    # 关联
    prediction_id = Column(Integer, ForeignKey("ai_predictions.id"))
    calculator_id = Column(Integer, ForeignKey("financial_base_calculations.id"))
    statistical_ref_id = Column(Integer, ForeignKey("statistical_references.id"))
    
    # 预测状态
    status = Column(SQLEnum(PredictionStatus), default=PredictionStatus.PENDING)
    
    # 模型权重
    model_weights = Column(JSON)  # 各个模型的权重配置
    
    # 预测结果
    prediction_results = Column(JSON)  # 综合预测结果
    prediction_metadata = Column(JSON)  # 预测过程元数据
    
    # 评估指标
    prediction_variance = Column(Float)
    confidence_score = Column(Float)
    accuracy_metrics = Column(JSON)
    
    # 版本控制
    version = Column(String(50))
    iteration = Column(Integer, default=1)
    
    # 关系
    ai_prediction = relationship("AIPrediction", back_populates="hybrid_manager")
    base_calculator = relationship("FinancialBaseCalculator", back_populates="hybrid_predictions")
    statistical_reference = relationship("StatisticalReference", back_populates="hybrid_predictions")

    def calculate_weighted_prediction(self):
        """计算加权预测结果"""
        if not all([self.model_weights, self.prediction_results]):
            return None
            
        weighted_result = {}
        for category, predictions in self.prediction_results.items():
            if category in self.model_weights:
                weighted_result[category] = sum(
                    pred * weight for pred, weight 
                    in zip(predictions, self.model_weights[category])
                )
        return weighted_result

    def update_confidence_score(self):
        """更新置信度分数"""
        if self.prediction_variance:
            self.confidence_score = 1 / (1 + self.prediction_variance)