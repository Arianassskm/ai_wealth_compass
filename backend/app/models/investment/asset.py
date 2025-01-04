from sqlalchemy import Column, Integer, Float, String, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class AssetType(str, enum.Enum):
    STOCK = "stock"
    BOND = "bond"
    FUND = "fund"
    REAL_ESTATE = "real_estate"
    CASH = "cash"
    COMMODITY = "commodity"
    CRYPTOCURRENCY = "cryptocurrency"

class Asset(BaseModel):
    __tablename__ = "assets"
    
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    
    # 资产信息
    name = Column(String(100))
    asset_type = Column(SQLEnum(AssetType))
    ticker = Column(String(20))
    quantity = Column(Float)
    
    # 价值信息
    purchase_price = Column(Float)
    current_price = Column(Float)
    current_value = Column(Float)
    cost_basis = Column(Float)
    
    # 收益信息
    return_rate = Column(Float)
    dividend_yield = Column(Float)
    realized_gains = Column(Float)
    unrealized_gains = Column(Float)
    
    # 风险指标
    volatility = Column(Float)
    beta = Column(Float)
    correlation = Column(JSON)  # 与其他资产的相关性
    
    # 分析数据
    historical_prices = Column(JSON)
    performance_metrics = Column(JSON)
    risk_metrics = Column(JSON)
    
    # 关系
    portfolio = relationship("Portfolio", back_populates="assets")
    transactions = relationship("AssetTransaction", back_populates="asset")

    def calculate_returns(self):
        """计算资产回报"""
        if self.current_price and self.purchase_price and self.purchase_price > 0:
            self.return_rate = (self.current_price - self.purchase_price) / self.purchase_price
            self.unrealized_gains = (self.current_price - self.purchase_price) * self.quantity
            
        self.current_value = self.current_price * self.quantity if all([self.current_price, self.quantity]) else 0
        return {
            'return_rate': self.return_rate,
            'unrealized_gains': self.unrealized_gains,
            'current_value': self.current_value
        }

    def update_risk_metrics(self):
        """更新风险指标"""
        if self.historical_prices:
            # 计算波动率
            returns = self._calculate_historical_returns()
            self.volatility = self._calculate_volatility(returns)
            
            # 更新风险指标
            self.risk_metrics = {
                'volatility': self.volatility,
                'beta': self.beta,
                'var': self._calculate_var(returns),
                'sharpe_ratio': self._calculate_sharpe_ratio(returns)
            }