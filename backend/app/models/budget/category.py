from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class BudgetCategory(Base):
    """预算分类表"""
    __tablename__ = "budget_categories"

    name = Column(String(50), nullable=False)
    parent_id = Column(Integer, ForeignKey("budget_categories.id"), index=True)
    is_active = Column(Boolean, default=True)
    description = Column(String(255))
    icon = Column(String(50))
    
    # 关联关系
    budgets = relationship("Budget", back_populates="category")
    subcategories = relationship("BudgetCategory",
                               backref=relationship("parent", remote_side=[id])) 