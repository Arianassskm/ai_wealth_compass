from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class GiftAnalysisRequest(BaseModel):
    """人情分析请求模型"""
    province: str = Field(..., description="省份")
    city: str = Field(..., description="城市")
    event_time: datetime = Field(..., description="事件时间")
    relationship: str = Field(..., description="关系")
    scenario: str = Field(..., description="场景")
    amount: Optional[str] = Field(None, description="金额/礼物")

class GiftAnalysisResponse(BaseModel):
    """人情分析响应模型"""
    suggestion: str = Field(..., description="建议")
    reasoning: str = Field(..., description="分析依据")
    amount_range: str = Field(..., description="建议金额范围")
    considerations: list[str] = Field(..., description="注意事项") 