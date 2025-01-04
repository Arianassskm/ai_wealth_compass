from pydantic import BaseModel, Field
from typing import Dict, Optional, List
from datetime import datetime
from enum import Enum

class PredictionType(str, Enum):
    BUDGET = "budget"
    INVESTMENT = "investment"
    WEALTH = "wealth"
    GOALS = "goals"

class PredictionAdjustment(BaseModel):
    prediction_type: PredictionType
    adjustments: Dict[str, float]
    reason: Optional[str] = None

class PredictionResponse(BaseModel):
    id: int
    user_id: int
    prediction_type: PredictionType
    predicted_values: Dict
    confidence_score: float
    created_at: datetime
    is_calibrated: bool = False
    
    class Config:
        from_attributes = True

class PredictionHistory(BaseModel):
    id: int
    prediction_type: PredictionType
    original_values: Dict
    adjusted_values: Optional[Dict]
    calibration_date: Optional[datetime]
    confidence_score: float
    
    class Config:
        from_attributes = True