from sqlalchemy import Column, String, Enum as SQLEnum, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
from datetime import datetime
import enum

class LifeStage(str, enum.Enum):
    STUDENT = "student"
    FRESH_GRADUATE = "fresh_graduate"
    EARLY_CAREER = "early_career"
    MID_CAREER = "mid_career"
    PRE_RETIREMENT = "pre_retirement"
    RETIREMENT = "retirement"

class FinancialStatus(str, enum.Enum):
    DEPENDENT = "dependent"
    SELF_SUFFICIENT = "self_sufficient"
    STABLE = "stable"
    WEALTHY = "wealthy"

class UserProfile(BaseModel):
    __tablename__ = "user_profiles"
    
    # 基础信息
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    age_group = Column(String(20))
    gender = Column(String(10))
    life_stage = Column(SQLEnum(LifeStage))
    region_code = Column(String(50))
    
    # 生活状态
    financial_status = Column(SQLEnum(FinancialStatus))
    housing_status = Column(String(50))
    employment_status = Column(String(50))
    lifestyle_status = Column(String(50))
    
    # 目标设定
    short_term_goal = Column(JSON)  # 包含目标描述和预期金额
    mid_term_goal = Column(JSON)
    long_term_goal = Column(JSON)
    
    # AI预测相关
    prediction_version = Column(Integer, default=1)
    last_calibration_date = Column(DateTime)
    profile_completion_rate = Column(Float, default=0.0)
    
    # 附加信息
    preferences = Column(JSON)  # 用户偏好设置
    risk_tolerance = Column(String(20))  # 风险承受能力
    
    # 关系
    user = relationship("User", back_populates="profile")
    risk_assessments = relationship("RiskAssessment", back_populates="profile")
    lifecycle_factors = relationship("LifecycleFactor", back_populates="profile")

    @property
    def is_profile_complete(self):
        return self.profile_completion_rate >= 0.8

    def update_completion_rate(self):
        """计算档案完成度"""
        required_fields = ['age_group', 'gender', 'life_stage', 'financial_status']
        completed = sum(1 for field in required_fields if getattr(self, field))
        self.profile_completion_rate = completed / len(required_fields)