from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class LifeStageEnum(str, Enum):
    STUDENT = "student"
    FRESH_GRADUATE = "fresh_graduate"
    EARLY_CAREER = "early_career"
    MID_CAREER = "mid_career"
    PRE_RETIREMENT = "pre_retirement"
    RETIREMENT = "retirement"

class UserProfileBase(BaseModel):
    age_group: str
    gender: str
    life_stage: LifeStageEnum
    region_code: str
    financial_status: str
    housing_status: str
    employment_status: str
    lifestyle_status: str

class UserProfileCreate(UserProfileBase):
    user_id: int
    short_term_goal: Dict[str, Any]
    mid_term_goal: Dict[str, Any]
    long_term_goal: Dict[str, Any]

class UserProfileResponse(UserProfileBase):
    id: int
    created_at: datetime
    prediction_version: int
    profile_completion_rate: float
    
    class Config:
        from_attributes = True