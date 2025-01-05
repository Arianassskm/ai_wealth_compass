"""用户模型"""
from sqlalchemy import Column, String, Enum
from app.models.base import BaseModel
from app.models.types import UserRole

class User(BaseModel):
    """用户模型"""
    __tablename__ = "users"

    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(100))
    role = Column(Enum(UserRole), default=UserRole.USER)
    
    def __repr__(self):
        return f"<User {self.username}>"