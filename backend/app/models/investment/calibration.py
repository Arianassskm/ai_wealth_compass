from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.base import Base

class AssetCalibration(Base):
    """资产校准表"""
    __tablename__ = "asset_calibrations"

    investment_id = Column(Integer, ForeignKey("investments.id"), nullable=False, index=True)
    calibration_date = Column(DateTime, nullable=False, index=True)
    actual_value = Column(Numeric(15, 2), nullable=False)
    difference = Column(Numeric(15, 2))
    calibration_source = Column(String(50), nullable=False)
    notes = Column(String(255))
    
    # 关联关系
    investment = relationship("Investment", back_populates="calibrations") 