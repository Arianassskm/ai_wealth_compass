from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from enum import Enum

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    role: str

    class Config:
        from_attributes = True

class AccountBase(BaseModel):
    name: str
    account_type: str
    balance: float
    currency: str = "CNY"
    description: Optional[str] = None

class AccountCreate(AccountBase):
    user_id: int

class AccountResponse(AccountBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True