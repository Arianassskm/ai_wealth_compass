# services/background_tasks.py
from celery import Celery
from app.core.config import settings
from app.services.profile_service import ProfileService
from app.db.session import SessionLocal

# 创建Celery实例，用于处理后台任务
celery = Celery(
    "tasks",
    broker=settings.REDIS_URL,    # 消息代理URL
    backend=settings.REDIS_URL    # 结果后端URL
)

@celery.task
async def update_user_predictions(user_id: int):
    """
    更新用户预测的后台任务
    
    参数:
        user_id: 需要更新预测的用户ID
    """
    try:
        # 创建数据库会话
        db = SessionLocal()
        # 创建画像服务实例
        profile_service = ProfileService(db)
        # 执行预测更新
        await profile_service.update_predictions(user_id)
    finally:
        # 确保关闭数据库连接
        db.close()

@celery.task
async def generate_financial_reports(user_id: int):
    """生成财务报告"""
    try:
        db = SessionLocal()
        profile_service = ProfileService(db)
        await profile_service.generate_reports(user_id)
    finally:
        db.close()