from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum

class Gender(str, Enum):
    """性别枚举"""
    MALE = "male"
    FEMALE = "female"

class LifeStage(str, Enum):
    """人生阶段枚举"""
    STUDENT = "student"
    FRESH_GRADUATE = "fresh_graduate"
    CAREER_START = "career_start"
    CAREER_GROWTH = "career_growth"
    SINGLE = "single"
    RELATIONSHIP = "relationship"
    MARRIED = "married"
    PARENT = "parent"
    MIDLIFE = "midlife"
    RETIREMENT = "retirement"

class UserProfileBase(BaseModel):
    """用户画像基础模型"""
    # Step 1: 基础信息
    age_group: str = Field(..., description="年龄段", example="90后")
    gender: Gender = Field(..., description="性别")
    
    # Step 2: 人生阶段
    life_stage: LifeStage = Field(..., description="人生阶段")
    
    # Step 3: 生活状况
    financial_status: str = Field(..., description="财务状况", example="小有盈余")
    housing_status: str = Field(..., description="住房状况", example="小家初成")
    employment_status: str = Field(..., description="就业状况", example="朝九晚五")
    lifestyle: str = Field(..., description="生活方式", example="品质追求")
    
    # Step 4: 人生目标
    short_term_goal: str = Field(..., description="短期目标", example="能睡懒觉")
    mid_term_goal: str = Field(..., description="中期目标", example="小家安居")
    long_term_goal: str = Field(..., description="长期目标", example="早早退休")

class UserProfileCreate(UserProfileBase):
    """用户画像创建模型"""
    user_id: int = Field(..., gt=0, description="用户ID")

class UserProfileUpdate(BaseModel):
    """用户画像更新模型"""
    age_group: Optional[str] = None
    gender: Optional[Gender] = None
    life_stage: Optional[LifeStage] = None
    financial_status: Optional[str] = None
    housing_status: Optional[str] = None
    employment_status: Optional[str] = None
    lifestyle: Optional[str] = None
    short_term_goal: Optional[str] = None
    mid_term_goal: Optional[str] = None
    long_term_goal: Optional[str] = None

class UserProfileInDB(UserProfileBase):
    """数据库用户画像模型"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class UserProfileResponse(UserProfileBase):
    """用户画像响应模型"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)