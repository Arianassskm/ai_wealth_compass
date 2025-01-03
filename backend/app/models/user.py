# app/models/user.py
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Boolean, Column, String, DateTime, Integer, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.models.base import Base
import enum

class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"

class LifeStage(str, enum.Enum):
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

class User(Base):
    """用户表"""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(100))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关联关系
    profile: Mapped["UserProfile"] = relationship("UserProfile", back_populates="user", uselist=False)
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user")

class UserProfile(Base):
    """用户画像表"""
    __tablename__ = "user_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    
    # Step 1: 基础信息
    age_group: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    gender: Mapped[Gender] = mapped_column(Enum(Gender), nullable=False)
    
    # Step 2: 人生阶段
    life_stage: Mapped[LifeStage] = mapped_column(Enum(LifeStage), nullable=False)
    
    # Step 3: 生活状况
    financial_status: Mapped[str] = mapped_column(String(50), nullable=False)
    housing_status: Mapped[str] = mapped_column(String(50), nullable=False)
    employment_status: Mapped[str] = mapped_column(String(50), nullable=False)
    lifestyle: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Step 4: 人生目标
    short_term_goal: Mapped[str] = mapped_column(String(50), nullable=False)
    mid_term_goal: Mapped[str] = mapped_column(String(50), nullable=False)
    long_term_goal: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # 扩展信息
    additional_info: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    # 时间戳
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关联关系
    user: Mapped["User"] = relationship("User", back_populates="profile")