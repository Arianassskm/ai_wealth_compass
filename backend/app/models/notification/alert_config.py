from sqlalchemy import Column, Integer, Float, String, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class AlertLevel(str, enum.Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"
    EMERGENCY = "emergency"

class AlertCategory(str, enum.Enum):
    BUDGET = "budget"
    SPENDING = "spending"
    INVESTMENT = "investment"
    RISK = "risk"
    CASH_FLOW = "cash_flow"

class AlertConfig(BaseModel):
    __tablename__ = "alert_configs"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # 基本配置
    category = Column(SQLEnum(AlertCategory))
    name = Column(String(100))
    description = Column(String(500))
    is_active = Column(Boolean, default=True)
    
    # 阈值设置
    thresholds = Column(JSON)  # 不同级别的阈值设置
    warning_conditions = Column(JSON)  # 触发条件
    
    # 默认阈值配置
    default_warning_threshold = Column(Float)  # 默认黄线 (如: 80%)
    default_critical_threshold = Column(Float)  # 默认红线 (如: 95%)
    
    # 自定义规则
    custom_rules = Column(JSON)  # 自定义预警规则
    evaluation_frequency = Column(String(50))  # 评估频率
    
    # AI调整
    ai_suggested_thresholds = Column(JSON)  # AI建议的阈值
    threshold_history = Column(JSON)  # 阈值调整历史
    
    # 关系
    user = relationship("User", back_populates="alert_configs")
    alerts = relationship("Alert", back_populates="config")

    def get_threshold_for_level(self, level: AlertLevel) -> float:
        """获取特定级别的阈值"""
        if not self.thresholds:
            return {
                AlertLevel.INFO: 0.7,
                AlertLevel.WARNING: 0.8,
                AlertLevel.CRITICAL: 0.9,
                AlertLevel.EMERGENCY: 0.95
            }.get(level)
            
        return self.thresholds.get(level.value)

    def evaluate_condition(self, current_value: float, category_data: dict) -> tuple[bool, AlertLevel]:
        """评估是否触发预警"""
        for level in [AlertLevel.EMERGENCY, AlertLevel.CRITICAL, AlertLevel.WARNING, AlertLevel.INFO]:
            threshold = self.get_threshold_for_level(level)
            if threshold and current_value >= threshold:
                return True, level
        return False, None