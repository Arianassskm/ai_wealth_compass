from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class AgeGroup(str, Enum):
    UNDER_25 = "under_25"
    AGE_25_35 = "25_35"
    AGE_35_45 = "35_45"
    AGE_45_55 = "45_55"
    ABOVE_55 = "above_55"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"

class UserBasicInfo(BaseModel):
    age_group: AgeGroup
    gender: Gender
    
class LifeStageUpdate(BaseModel):
    life_stage: str
    description: Optional[str] = None

class LifestyleInfo(BaseModel):
    financial_status: str
    housing_status: str
    employment_status: str
    lifestyle_status: str

class LifeGoals(BaseModel):
    short_term_goal: str
    mid_term_goal: str
    long_term_goal: str

class UserProfileResponse(BaseModel):
    id: int
    user_id: int
    age_group: Optional[str]
    gender: Optional[str]
    life_stage: Optional[str]
    financial_status: Optional[str]
    housing_status: Optional[str]
    employment_status: Optional[str]
    lifestyle_status: Optional[str]
    short_term_goal: Optional[str]
    mid_term_goal: Optional[str]
    long_term_goal: Optional[str]

    class Config:
        from_attributes = True

class OnboardingStatus(BaseModel):
    basic_info_completed: bool
    life_stage_completed: bool
    lifestyle_completed: bool
    goals_completed: bool
    all_completed: bool