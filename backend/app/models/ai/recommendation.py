from sqlalchemy import Column, Integer, String, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class RecommendationType(str, enum.Enum):
    BUDGET_ADJUSTMENT = "budget_adjustment"
    INVESTMENT_SUGGESTION = "investment_suggestion"
    RISK_MITIGATION = "risk_mitigation"
    LIFECYCLE_PLANNING = "lifecycle_planning"

class AIRecommendation(BaseModel):
    __tablename__ = "ai_recommendations"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    prediction_id = Column(Integer, ForeignKey("ai_predictions.id"))
    
    # 推荐信息
    type = Column(SQLEnum(RecommendationType))
    title = Column(String(200))
    description = Column(String(500))
    priority = Column(Integer)
    
    # 推荐详情
    recommendation_details = Column(JSON)  # 详细建议
    action_steps = Column(JSON)  # 行动步骤
    expected_impact = Column(JSON)  # 预期影响
    
    # 分析依据
    reasoning = Column(JSON)  # 推荐理由
    data_support = Column(JSON)  # 支持数据
    
    # 推荐状态
    user_feedback = Column(JSON)  # 用户反馈
    implementation_status = Column(String(50))
    effectiveness_score = Column(Float)
    
    # 关系
    user = relationship("User", back_populates="recommendations")
    prediction = relationship("AIPrediction", back_populates="recommendations")

    def generate_action_plan(self):
        """生成行动计划"""
        if not self.recommendation_details:
            return None
            
        action_plan = {
            'immediate_actions': [],
            'short_term_actions': [],
            'long_term_actions': []
        }
        
        for detail in self.recommendation_details:
            priority = detail.get('priority', 'medium')
            action = {
                'description': detail.get('action'),
                'timeline': detail.get('timeline'),
                'resources': detail.get('resources'),
                'expected_outcome': detail.get('outcome')
            }
            
            if priority == 'high':
                action_plan['immediate_actions'].append(action)
            elif priority == 'medium':
                action_plan['short_term_actions'].append(action)
            else:
                action_plan['long_term_actions'].append(action)
                
        self.action_steps = action_plan
        return action_plan

    def evaluate_effectiveness(self):
        """评估推荐效果"""
        if not (self.user_feedback and self.expected_impact):
            return None
            
        evaluation = {
            'implementation_rate': self._calculate_implementation_rate(),
            'user_satisfaction': self._calculate_satisfaction_score(),
            'impact_achievement': self._calculate_impact_achievement()
        }
        
        self.effectiveness_score = sum(evaluation.values()) / len(evaluation)
        return evaluation