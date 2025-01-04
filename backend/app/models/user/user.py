from sqlalchemy import Column, String, Enum
from sqlalchemy.orm import relationship
from .base_model import BaseModel
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    VIP = "vip"

class User(BaseModel):
    __tablename__ = "users"

    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(200))
    full_name = Column(String(100))
    role = Column(Enum(UserRole), default=UserRole.USER)
    phone = Column(String(20))

    # 关系
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    accounts = relationship("Account", back_populates="user")
    predictions = relationship("AIPrediction", back_populates="user")