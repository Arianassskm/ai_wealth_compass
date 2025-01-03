from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, JSONB
from sqlalchemy.orm import relationship
from app.models.base import Base

class Transaction(Base):
    """交易记录表"""
    __tablename__ = "transactions"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Numeric(15, 2), nullable=False)
    type = Column(String(20), nullable=False, index=True)  # income/expense
    category_id = Column(Integer, ForeignKey("transaction_categories.id"), nullable=False, index=True)
    payment_method_id = Column(Integer, ForeignKey("payment_methods.id"), index=True)
    transaction_date = Column(DateTime, nullable=False, index=True)
    description = Column(String(255))
    metadata = Column(JSONB)  # 额外的交易信息
    
    # 关联关系
    user = relationship("User", back_populates="transactions")
    category = relationship("TransactionCategory", back_populates="transactions")
    payment_method = relationship("PaymentMethod", back_populates="transactions") 