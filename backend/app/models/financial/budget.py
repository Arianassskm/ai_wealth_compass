from sqlalchemy import Column, Integer, Float, String, JSON, ForeignKey, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class BudgetType(str, enum.Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUAL = "annual"
    CUSTOM = "custom"

class BudgetStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"

class Budget(BaseModel):
    __tablename__ = "budgets"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    prediction_id = Column(Integer, ForeignKey("hybrid_predictions.id"))
    lifecycle_id = Column(Integer, ForeignKey("lifecycle_models.id"))
    
    # 基本信息
    name = Column(String(100))
    type = Column(SQLEnum(BudgetType))
    status = Column(SQLEnum(BudgetStatus), default=BudgetStatus.DRAFT)
    
    # 预算详情
    total_income = Column(Float)
    total_expense = Column(Float)
    saving_target = Column(Float)
    investment_allocation = Column(Float)
    
    # 分类预算
    category_budgets = Column(JSON)  # 各类别的预算分配
    actual_spending = Column(JSON)   # 实际支出记录
    
    # AI/算法相关
    is_ai_generated = Column(Boolean, default=False)
    user_adjusted = Column(Boolean, default=False)
    confidence_score = Column(Float)
    adjustment_history = Column(JSON)
    
    # 预算分析
    variance_analysis = Column(JSON)  # 预算差异分析
    performance_metrics = Column(JSON)  # 预算执行情况指标
    
    # 关系
    user = relationship("User", back_populates="budgets")
    hybrid_prediction = relationship("HybridPredictionManager", back_populates="budgets")
    lifecycle_model = relationship("LifecycleModel", back_populates="budgets")
    transactions = relationship("Transaction", back_populates="budget")

    def calculate_budget_performance(self):
        """计算预算执行情况"""
        if self.category_budgets and self.actual_spending:
            performance = {}
            for category, budget in self.category_budgets.items():
                actual = self.actual_spending.get(category, 0)
                performance[category] = {
                    'budget': budget,
                    'actual': actual,
                    'variance': budget - actual,
                    'variance_percentage': ((budget - actual) / budget * 100) if budget else 0
                }
            return performance
        return None

    def update_confidence_score(self, actual_data):
        """更新预算置信度分数"""
        if not actual_data:
            return
            
        variances = []
        for category, budget in self.category_budgets.items():
            actual = actual_data.get(category, 0)
            if budget > 0:
                variance = abs(budget - actual) / budget
                variances.append(variance)
                
        if variances:
            avg_variance = sum(variances) / len(variances)
            self.confidence_score = 1 / (1 + avg_variance)