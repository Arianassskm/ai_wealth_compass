from sqlalchemy import Column, Integer, Float, JSON, ForeignKey, String, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class PredictionType(str, enum.Enum):
    BUDGET = "budget"
    INVESTMENT = "investment"
    RISK = "risk"
    LIFECYCLE = "lifecycle"
    COMPREHENSIVE = "comprehensive"

class AIPrediction(BaseModel):
    __tablename__ = "ai_predictions"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    hybrid_prediction_id = Column(Integer, ForeignKey("hybrid_predictions.id"))
    
    # 预测类型和状态
    prediction_type = Column(SQLEnum(PredictionType))
    version = Column(String(50))
    model_version = Column(String(50))
    
    # 预测结果
    predicted_budget = Column(JSON)  # 预算预测
    predicted_investments = Column(JSON)  # 投资建议
    predicted_risks = Column(JSON)  # 风险预测
    predicted_lifecycle = Column(JSON)  # 生命周期预测
    
    # 预测指标
    confidence_scores = Column(JSON)  # 各维度置信度
    accuracy_metrics = Column(JSON)  # 准确度指标
    validation_results = Column(JSON)  # 验证结果
    
    # 模型参数
    model_parameters = Column(JSON)  # 使用的模型参数
    feature_importance = Column(JSON)  # 特征重要性
    
    # 预测依据
    input_features = Column(JSON)  # 输入特征
    prediction_rationale = Column(JSON)  # 预测理由
    
    # 关系
    user = relationship("User", back_populates="predictions")
    hybrid_prediction = relationship("HybridPredictionManager", back_populates="ai_prediction")
    calibrations = relationship("AICalibration", back_populates="prediction")

    def validate_prediction(self, actual_data):
        """验证预测准确性"""
        if not actual_data:
            return None
            
        validation = {
            'accuracy': {},
            'deviation': {},
            'confidence_update': {}
        }
        
        for category, predicted in self.predicted_budget.items():
            actual = actual_data.get(category, 0)
            if actual > 0:
                accuracy = 1 - abs(predicted - actual) / actual
                deviation = abs(predicted - actual)
                
                validation['accuracy'][category] = accuracy
                validation['deviation'][category] = deviation
                
        self.validation_results = validation
        self._update_confidence_scores(validation)
        return validation

    def generate_insights(self):
        """生成AI洞察"""
        insights = {
            'key_findings': [],
            'recommendations': [],
            'risk_alerts': [],
            'opportunities': []
        }
        
        # 分析预算预测
        if self.predicted_budget:
            insights['key_findings'].extend(self._analyze_budget_patterns())
            
        # 分析投资预测
        if self.predicted_investments:
            insights['opportunities'].extend(self._analyze_investment_opportunities())
            
        # 分析风险预测
        if self.predicted_risks:
            insights['risk_alerts'].extend(self._analyze_risk_patterns())
            
        return insights