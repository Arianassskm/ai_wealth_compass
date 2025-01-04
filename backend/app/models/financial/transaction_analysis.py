from sqlalchemy import Column, Integer, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel

class TransactionAnalysis(BaseModel):
    __tablename__ = "transaction_analyses"
    
    transaction_id = Column(Integer, ForeignKey("transactions.id"))
    
    # 分析结果
    category_confidence = Column(Float)
    pattern_matching = Column(JSON)  # 交易模式匹配结果
    anomaly_score = Column(Float)    # 异常检测分数
    impact_analysis = Column(JSON)   # 对预算和目标的影响分析
    
    # 预测数据
    future_implications = Column(JSON)  # 对未来财务状况的影响预测
    recommended_actions = Column(JSON)  # 推荐操作
    
    # AI分析结果
    ai_insights = Column(JSON)
    confidence_scores = Column(JSON)
    
    # 关系
    transaction = relationship("Transaction", back_populates="analysis")

    def detect_anomalies(self):
        """检测交易异常"""
        if self.transaction and self.pattern_matching:
            historical_pattern = self.pattern_matching.get('historical_average', 0)
            current_amount = self.transaction.amount
            
            if historical_pattern > 0:
                deviation = abs(current_amount - historical_pattern) / historical_pattern
                self.anomaly_score = deviation
                
            return self.anomaly_score > 0.5  # 返回是否异常
        return None