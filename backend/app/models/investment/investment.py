from datetime import datetime
from typing import List
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Numeric, Text
from sqlalchemy.orm import relationship
from app.models.base import Base

class Investment(Base):
    """投资表"""
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False, index=True)
    amount = Column(Numeric(precision=15, scale=2), nullable=False)
    description = Column(Text)
    
    # 关联关系
    user = relationship("User", back_populates="investments")
    records = relationship("InvestmentRecord", back_populates="investment")
    estimations = relationship("AssetEstimation", back_populates="investment")
    calibrations = relationship("AssetCalibration", back_populates="investment")

class InvestmentRecord(Base):
    """投资记录表"""
    __tablename__ = "investment_records"

    id = Column(Integer, primary_key=True, index=True)
    investment_id = Column(Integer, ForeignKey("investments.id"), nullable=False, index=True)
    type = Column(String(50), nullable=False, index=True)
    amount = Column(Numeric(precision=15, scale=2), nullable=False)
    price = Column(Numeric(precision=15, scale=2), nullable=False)
    description = Column(Text)
    
    # 关联关系
    investment = relationship("Investment", back_populates="records")

class AssetEstimation(Base):
    """资产估值表"""
    __tablename__ = "asset_estimations"

    id = Column(Integer, primary_key=True, index=True)
    investment_id = Column(Integer, ForeignKey("investments.id"), nullable=False, index=True)
    estimated_value = Column(Numeric(precision=15, scale=2), nullable=False)
    confidence_level = Column(Numeric(precision=5, scale=2))
    estimation_method = Column(String(50), nullable=False)
    description = Column(Text)
    
    # 关联关系
    investment = relationship("Investment", back_populates="estimations")

class AssetCalibration(Base):
    """资产校准表"""
    __tablename__ = "asset_calibrations"

    id = Column(Integer, primary_key=True, index=True)
    investment_id = Column(Integer, ForeignKey("investments.id"), nullable=False, index=True)
    actual_value = Column(Numeric(precision=15, scale=2), nullable=False)
    calibration_method = Column(String(50), nullable=False)
    description = Column(Text)
    
    # 关联关系
    investment = relationship("Investment", back_populates="calibrations") 