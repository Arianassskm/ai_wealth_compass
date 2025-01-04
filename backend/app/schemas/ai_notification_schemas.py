from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
from enum import Enum
from datetime import datetime

class AnalysisBase(BaseModel):
    analysis_type: str
    input_data: Dict[str, Any]

class AnalysisResponse(AnalysisBase):
    id: int
    results: Dict[str, Any]
    confidence_score: float
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationBase(BaseModel):
    type: str
    content: Dict[str, Any]
    priority: int
    reasoning: str

class RecommendationResponse(RecommendationBase):
    id: int
    is_implemented: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    type: str
    priority: str
    title: str
    content: str
    data: Optional[Dict[str, Any]] = None

class NotificationResponse(NotificationBase):
    id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AlertRuleBase(BaseModel):
    name: str
    type: str
    conditions: Dict[str, Any]
    threshold: float
    notification_channels: List[str]

class AlertRuleResponse(AlertRuleBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
