from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime

class UserBase(BaseModel):
    """用户基础模型"""
    email: EmailStr = Field(
        ...,  # ... 表示必填字段
        description="用户邮箱",
        example="user@example.com"
    )
    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="用户名",
        example="johndoe"
    )

class UserCreate(UserBase):
    """用户创建模型"""
    password: str = Field(
        ...,
        min_length=6,
        description="用户密码",
        example="strongpassword123"
    )

class UserUpdate(BaseModel):
    """用户更新模型"""
    email: Optional[EmailStr] = Field(
        None,
        description="用户邮箱",
        example="newemail@example.com"
    )
    username: Optional[str] = Field(
        None,
        min_length=3,
        max_length=50,
        description="用户名",
        example="johndoe_new"
    )
    password: Optional[str] = Field(
        None,
        min_length=6,
        description="用户密码",
        example="newpassword123"
    )

class UserInDB(UserBase):
    """数据库用户模型"""
    id: int = Field(..., description="用户ID", example=1)
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class UserResponse(UserBase):
    """用户响应模型"""
    id: int = Field(..., description="用户ID", example=1)
    created_at: datetime = Field(
        ...,
        description="创建时间",
        example="2024-03-18T10:00:00"
    )
    
    model_config = ConfigDict(from_attributes=True) 