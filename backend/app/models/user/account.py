"""账户模型"""
from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
from app.models.types import AccountType, AccountStatus

class Account(BaseModel):
    """账户模型"""
    __tablename__ = "accounts"

    user_id = Column(Integer, ForeignKey("users.id"))
    account_type = Column(Enum(AccountType))
    status = Column(Enum(AccountStatus), default=AccountStatus.ACTIVE)
    balance = Column(Float, default=0.0)
    currency = Column(String(10), default="CNY")
    
    # 关系
    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")
    
    def __repr__(self):
        return f"<Account {self.account_type} - {self.balance}>"