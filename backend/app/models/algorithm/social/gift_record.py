from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from app.models.base import BaseModel

class GiftRecord(BaseModel):
    __tablename__ = "gift_records"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    scenario = Column(String(100))
    relationship = Column(String(50))
    amount = Column(Float)
    location = Column(String(100))
    event_time = Column(DateTime) 