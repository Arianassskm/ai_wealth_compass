from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime, date
from enum import Enum

class AssetType(str, Enum):
    STOCKS = "stocks"
    BONDS = "bonds"
    REAL_ESTATE = "real_estate"
    CASH = "cash"
    CRYPTO = "crypto"
    COMMODITIES = "commodities"

class RiskLevel(str, Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"

class PortfolioCreate(BaseModel):
    risk_level: RiskLevel
    target_allocation: Dict[AssetType, float]
    initial_investment: float = Field(gt=0)
    investment_horizon: int = Field(gt=0)  # 以月为单位

class PortfolioResponse(BaseModel):
    id: int
    user_id: int
    risk_level: RiskLevel
    current_allocation: Dict[AssetType, float]
    target_allocation: Dict[AssetType, float]
    total_value: float
    return_rate: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PortfolioAdjustment(BaseModel):
    adjustments: Dict[AssetType, float]
    reason: Optional[str] = None

class InvestmentAnalysis(BaseModel):
    period_start: date
    period_end: date
    total_return: float
    return_rate: float
    risk_metrics: Dict[str, float]
    asset_performance: Dict[AssetType, Dict[str, float]]
    rebalancing_needed: bool
    diversification_score: float
    
    class Config:
        from_attributes = True

class InvestmentRecommendation(BaseModel):
    asset_type: AssetType
    action: str
    target_percentage: float
    reason: str
    potential_impact: Dict[str, float]
    risk_level: str
    confidence_score: float