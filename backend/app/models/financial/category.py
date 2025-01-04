from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel

class Category(BaseModel):
    __tablename__ = "categories"
    
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    name = Column(String(100))
    path = Column(String(255))  # 完整分类路径
    level = Column(Integer)
    
    # 分类属性
    attributes = Column(JSON)  # 分类特征
    rules = Column(JSON)      # 分类规则
    keywords = Column(JSON)   # 关键词匹配
    
    # 统计数据
    usage_count = Column(Integer, default=0)
    average_amount = Column(Float)
    
    # AI相关
    prediction_accuracy = Column(Float)
    suggested_budget = Column(JSON)
    
    # 关系
    parent = relationship("Category", remote_side=[id], backref="children")
    transactions = relationship("Transaction", back_populates="category")

    def update_statistics(self, transaction_amount):
        """更新分类统计数据"""
        self.usage_count += 1
        if self.average_amount is None:
            self.average_amount = transaction_amount
        else:
            self.average_amount = (
                (self.average_amount * (self.usage_count - 1) + transaction_amount)
                / self.usage_count
            )