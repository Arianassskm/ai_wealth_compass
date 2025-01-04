from sqlalchemy import Column, Integer, Float, String, JSON, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
from datetime import datetime

class Alert(BaseModel):
    __tablename__ = "alerts"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    config_id = Column(Integer, ForeignKey("alert_configs.id"))
    
    # 预警信息
    level = Column(SQLEnum(AlertLevel))
    category = Column(SQLEnum(AlertCategory))
    title = Column(String(200))
    message = Column(String(500))
    
    # 触发数据
    trigger_value = Column(Float)
    threshold_value = Column(Float)
    trigger_time = Column(DateTime, default=datetime.utcnow)
    
    # 详细信息
    alert_details = Column(JSON)  # 详细预警信息
    context_data = Column(JSON)  # 相关上下文数据
    impact_analysis = Column(JSON)  # 影响分析
    
    # 处理状态
    is_acknowledged = Column(Boolean, default=False)
    acknowledged_time = Column(DateTime)
    resolution_status = Column(String(50))
    resolution_time = Column(DateTime)
    
    # 关系
    user = relationship("User", back_populates="alerts")
    config = relationship("AlertConfig", back_populates="alerts")

    def calculate_severity(self) -> float:
        """计算预警严重程度"""
        if self.trigger_value is None or self.threshold_value is None:
            return 0
            
        exceed_ratio = (self.trigger_value - self.threshold_value) / self.threshold_value
        base_severity = {
            AlertLevel.INFO: 0.25,
            AlertLevel.WARNING: 0.5,
            AlertLevel.CRITICAL: 0.75,
            AlertLevel.EMERGENCY: 1.0
        }.get(self.level, 0)
        
        return min(1.0, base_severity * (1 + exceed_ratio))

    def generate_alert_message(self) -> str:
        """生成预警消息"""
        if not self.alert_details:
            return self.message
            
        template = {
            AlertCategory.BUDGET: "预算{category}已使用{percentage}%，超过{threshold}%警戒线",
            AlertCategory.SPENDING: "支出{category}增长异常，环比增长{percentage}%",
            AlertCategory.INVESTMENT: "投资{category}波动达到{percentage}%，超过预期",
            AlertCategory.RISK: "风险指数达到{value}，超过安全阈值{threshold}",
            AlertCategory.CASH_FLOW: "现金流{status}，预计影响持续{duration}天"
        }.get(self.category)
        
        return template.format(**self.alert_details) if template else self.message