from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from app.models.enums import LifeStage, FinancialStatus, RiskLevel

class FinancialGoal(BaseModel):
    description: str = Field(..., description="目标描述")
    target_amount: float = Field(..., description="目标金额")
    target_date: Optional[datetime] = Field(None, description="目标日期")

class UserPreferences(BaseModel):
    investment_style: str = Field(..., description="投资风格")
    preferred_assets: List[str] = Field(default_factory=list, description="偏好资产类型")
    risk_tolerance: RiskLevel = Field(..., description="风险承受能力")

class UserProfileBase(BaseModel):
    age_group: str = Field(..., description="年龄段")
    gender: str = Field(..., description="性别")
    life_stage: LifeStage = Field(..., description="生命阶段")
    financial_status: FinancialStatus = Field(..., description="财务状态")
    risk_level: Optional[RiskLevel] = Field(None, description="风险等级")