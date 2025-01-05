"""缓存管理模块"""
from functools import lru_cache
from redis import Redis
from app.core.config import settings

@lru_cache()
def get_cache() -> Redis:
    """获取Redis缓存实例"""
    return Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        decode_responses=True
    ) 