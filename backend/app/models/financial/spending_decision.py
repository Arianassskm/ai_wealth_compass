from sqlalchemy import Column, Integer, Float, String, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class SpendingDecisionType(str, enum.Enum):
    ESSENTIAL = "essential"        # 必需品
    LIFESTYLE = "lifestyle"        # 生活品质
    LUXURY = "luxury"             # 奢侈品
    INVESTMENT = "investment"      # 投资性质

class SpendingDecision(BaseModel):
    __tablename__ = "spending_decisions"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # 基本消费信息
    amount = Column(Float)
    category = Column(String(100))
    payment_method = Column(String(50))
    decision_type = Column(SQLEnum(SpendingDecisionType))
    
    # 消费等价转化
    equivalence_mapping = Column(JSON)  # 存储消费等价物
    value_metrics = Column(JSON)      # 价值度量指标
    opportunity_cost = Column(JSON)   # 机会成本分析
    
    # 影响评估
    budget_impact = Column(JSON)      # 对预算的影响
    financial_health_impact = Column(JSON)  # 对财务健康度的影响
    lifecycle_impact = Column(JSON)   # 对生命周期目标的影响
    
    # AI评估结果
    decision_score = Column(Float)    # 决策评分
    recommendation = Column(JSON)     # 建议
    alternatives = Column(JSON)       # 替代方案
    
    # 关系
    user = relationship("User", back_populates="spending_decisions")

    def calculate_equivalence(self):
        """计算消费等价物"""
        if not self.amount:
            return None
            
        equivalence = {
            'coffee_cups': self.amount / 30,  # 等价多少杯咖啡
            'meals': self.amount / 50,        # 等价多少顿饭
            'monthly_savings': self.amount / 3000,  # 占月储蓄比例
            'working_hours': self.amount / 100,     # 等价工作小时
            'investment_potential': {
                'one_year': self.amount * 1.05,    # 一年后潜在投资收益
                'five_years': self.amount * 1.28,  # 五年后潜在投资收益
            }
        }
        
        self.equivalence_mapping = equivalence
        return equivalence

    def evaluate_opportunity_cost(self):
        """评估机会成本"""
        opportunity_cost = {
            'investment_loss': {
                'one_year': self.amount * 0.05,
                'five_years': self.amount * 0.28
            },
            'alternative_uses': [
                {
                    'type': 'emergency_fund',
                    'value': self.amount,
                    'impact': 'could_strengthen_financial_safety'
                },
                {
                    'type': 'skill_development',
                    'value': self.amount,
                    'impact': 'could_invest_in_personal_growth'
                }
            ],
            'long_term_impact': {
                'retirement_savings': self.amount * 2.5,  # 退休储蓄影响
                'wealth_building': self.amount * 1.8     # 财富积累影响
            }
        }
        
        self.opportunity_cost = opportunity_cost
        return opportunity_cost