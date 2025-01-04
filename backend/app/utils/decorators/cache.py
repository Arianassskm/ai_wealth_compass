def cache_result(expiry: int = 3600):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # 缓存逻辑
            pass
        return wrapper
    return decorator