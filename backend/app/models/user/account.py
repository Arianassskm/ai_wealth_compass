from sqlalchemy import Column, String, Float, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class AccountType(str, enum.Enum):
    SAVINGS = "savings"
    CHECKING = "checking"
    CREDIT = "credit"
    INVESTMENT = "investment"
    DIGITAL = "digital"

class Account(BaseModel):
    __tablename__ = "accounts"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100))
    account_type = Column(SQLEnum(AccountType))
    balance = Column(Float, default=0.0)
    currency = Column(String(10), default="CNY")
    
    # 新增字段
    institution = Column(String(100))  # 金融机构
    account_number = Column(String(50))  # 账号（加密存储）
    status = Column(String(50))
    metadata = Column(JSON)  # 额外信息
    
    # 关系
    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")