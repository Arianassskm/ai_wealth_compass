from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime

# 基础用户属性
class UserBase(BaseModel):
    username: str
    email: EmailStr
    is_active: Optional[bool] = True

# 创建用户时的请求模型
class UserCreate(UserBase):
    password: constr(min_length=8)
    confirm_password: str

# 更新用户信息的请求模型
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[constr(min_length=8)] = None

# 用户信息响应模型
class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 用户登录请求模型
class UserLogin(BaseModel):
    email: EmailStr
    password: str