"""用户档案模型"""
from sqlalchemy import Column, String, Integer, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
from app.models.types import RiskLevel, InvestmentStyle

class UserProfile(BaseModel):
    """用户档案模型"""
    __tablename__ = "user_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    full_name = Column(String(100))
    phone = Column(String(20))
    address = Column(String(200))
    
    # 投资相关
    risk_tolerance = Column(Enum(RiskLevel), default=RiskLevel.MODERATE)
    investment_style = Column(Enum(InvestmentStyle), default=InvestmentStyle.BALANCED)
    investment_goals = Column(JSON)  # 投资目标列表
    
    # 关系
    user = relationship("User", back_populates="profile")
    
    def __repr__(self):
        return f"<UserProfile {self.full_name}>"