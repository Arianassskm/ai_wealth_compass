from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime

class CalculatorBase(BaseModel):
    region_code: str
    base_living_cost: float
    housing_index: float
    consumption_index: float
    income_potential: float
    career_growth_rate: float

class StatisticalReferenceBase(BaseModel):
    age_group: str
    life_stage: str
    region_code: str
    mean_income: float
    median_income: float
    income_std_dev: float
    expense_ratios: Dict[str, float]

class HybridPredictionBase(BaseModel):
    model_weights: Dict[str, List[float]]
    prediction_results: Dict[str, Any]
    confidence_score: float
    version: str

class PredictionResponse(BaseModel):
    id: int
    created_at: datetime
    prediction_results: Dict[str, Any]
    confidence_score: float
    status: str

    class Config:
        from_attributes = True
    