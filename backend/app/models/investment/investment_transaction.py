from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class TransactionType(str, enum.Enum):
    BUY = "buy"
    SELL = "sell"
    DIVIDEND = "dividend"
    SPLIT = "split"
    TRANSFER = "transfer"

class InvestmentTransaction(BaseModel):
    __tablename__ = "investment_transactions"
    
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    asset_id = Column(Integer, ForeignKey("assets.id"))
    
    # 交易信息
    transaction_type = Column(SQLEnum(TransactionType))
    transaction_date = Column(DateTime)
    quantity = Column(Float)
    price = Column(Float)
    total_amount = Column(Float)
    fees = Column(Float)
    
    # 交易细节
    broker = Column(String(100))
    execution_details = Column(JSON)
    settlement_status = Column(String(50))
    
    # 分析数据
    market_conditions = Column(JSON)
    timing_analysis = Column(JSON)
    impact_analysis = Column(JSON)
    
    # 关系
    portfolio = relationship("Portfolio", back_populates="transactions")
    asset = relationship("Asset", back_populates="transactions")

    def calculate_transaction_impact(self):
        """计算交易影响"""
        impact = {
            'cost_impact': self.total_amount + self.fees,
            'portfolio_change': self.quantity * self.price,
            'fee_percentage': (self.fees / self.total_amount) if self.total_amount else 0
        }
        
        if self.market_conditions:
            impact['market_timing'] = self._analyze_market_timing()
            
        return impact

    def _analyze_market_timing(self):
        """分析市场时机"""
        if not self.market_conditions:
            return None
            
        return {
            'market_trend': self.market_conditions.get('trend'),
            'volatility_level': self.market_conditions.get('volatility'),
            'timing_score': self._calculate_timing_score()
        }