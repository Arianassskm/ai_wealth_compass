from sqlalchemy import Column, Integer, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel

class AlertMonitor(BaseModel):
    __tablename__ = "alert_monitors"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # 监控状态
    last_check_time = Column(DateTime)
    next_check_time = Column(DateTime)
    monitoring_status = Column(String(50))
    
    # 监控数据
    monitored_metrics = Column(JSON)  # 被监控的指标
    check_frequency = Column(JSON)  # 不同类别的检查频率
    
    # 统计数据
    alert_statistics = Column(JSON)  # 预警统计
    trend_analysis = Column(JSON)  # 趋势分析
    
    # 智能调整
    threshold_adjustments = Column(JSON)  # 阈值自动调整记录
    optimization_suggestions = Column(JSON)  # 优化建议
    
    # 关系
    user = relationship("User", back_populates="alert_monitors")

    def check_alerts(self) -> list[dict]:
        """检查是否需要触发预警"""
        if not self.monitored_metrics:
            return []
            
        alerts = []
        current_time = datetime.utcnow()
        
        for metric, data in self.monitored_metrics.items():
            if self._should_check_metric(metric, current_time):
                alert = self._evaluate_metric(metric, data)
                if alert:
                    alerts.append(alert)
                    
        self.last_check_time = current_time
        self._update_statistics(alerts)
        return alerts

    def analyze_alert_patterns(self) -> dict:
        """分析预警模式"""
        if not self.alert_statistics:
            return {}
            
        patterns = {
            'frequent_alerts': self._identify_frequent_alerts(),
            'time_patterns': self._analyze_time_patterns(),
            'severity_trends': self._analyze_severity_trends(),
            'category_distribution': self._analyze_category_distribution()
        }
        
        self._update_optimization_suggestions(patterns)
        return patterns

    def _should_check_metric(self, metric: str, current_time: datetime) -> bool:
        """判断是否应该检查特定指标"""
        if not self.check_frequency:
            return True
            
        last_check = self.last_check_time
        frequency = self.check_frequency.get(metric, '1h')
        
        if frequency == '1h':
            return (current_time - last_check).total_seconds() >= 3600
        elif frequency == '1d':
            return (current_time - last_check).total_seconds() >= 86400
        return True