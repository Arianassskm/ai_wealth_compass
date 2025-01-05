from sqlalchemy import Column, Integer, ForeignKey, JSON, String, Float
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
from ..enums import RiskLevel

class InvestmentPreference(BaseModel):
    __tablename__ = "investment_preferences"
    
    profile_id = Column(Integer, ForeignKey("user_profiles.id"))
    risk_tolerance = Column(String(20))
    preferred_assets = Column(JSON)  # 存储资产类型列表
    investment_horizon = Column(String(20))
    target_return = Column(Float)
    
    # 关系
    profile = relationship("UserProfile", back_populates="investment_preferences") 