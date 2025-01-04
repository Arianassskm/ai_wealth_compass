from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class TransactionType(str, enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"
    INVESTMENT = "investment"

class Transaction(BaseModel):
    __tablename__ = "transactions"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"))
    budget_id = Column(Integer, ForeignKey("budgets.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    # 交易信息
    type = Column(SQLEnum(TransactionType))
    amount = Column(Float)
    currency = Column(String(10))
    description = Column(String(200))
    transaction_date = Column(DateTime)
    
    # 分类信息
    category_path = Column(String(200))  # 层级分类路径
    tags = Column(JSON)
    
    # 分析数据
    lifecycle_stage = Column(String(50))
    risk_impact = Column(Float)
    pattern_score = Column(Float)  # 交易模式匹配分数
    
    # 元数据
    location = Column(String(100))
    merchant = Column(String(100))
    receipt_data = Column(JSON)
    
    # 关系
    user = relationship("User", back_populates="transactions")
    account = relationship("Account", back_populates="transactions")
    budget = relationship("Budget", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
    analysis = relationship("TransactionAnalysis", back_populates="transaction", uselist=False)

    def calculate_risk_impact(self):
        """计算交易对风险状况的影响"""
        if self.amount and self.type:
            impact_factors = {
                TransactionType.EXPENSE: 1.2,
                TransactionType.INCOME: 0.8,
                TransactionType.TRANSFER: 1.0,
                TransactionType.INVESTMENT: 1.5
            }
            self.risk_impact = self.amount * impact_factors.get(self.type, 1.0)