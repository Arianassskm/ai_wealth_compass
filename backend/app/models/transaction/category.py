from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class TransactionCategory(Base):
    """交易分类表"""
    __tablename__ = "transaction_categories"

    name = Column(String(50), nullable=False)
    type = Column(String(20), nullable=False, index=True)  # income/expense
    parent_id = Column(Integer, ForeignKey("transaction_categories.id"), index=True)
    is_active = Column(Boolean, default=True)
    icon = Column(String(50))
    description = Column(String(255))
    
    # 关联关系
    transactions = relationship("Transaction", back_populates="category")
    subcategories = relationship("TransactionCategory", 
                               backref=relationship("parent", remote_side=[id])) 