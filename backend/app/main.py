from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine, Base
from app.core.config import settings
from app.middleware.logging import LoggingMiddleware
from app.middleware.error import ErrorHandlerMiddleware
from app.api.v1.api import api_router
from backend.scripts.db.test_connection import test_connection

def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description="AI Wealth Analysis API",
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # 注册中间件
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(ErrorHandlerMiddleware)

    # 注册路由
    app.include_router(
        api_router,
        prefix=settings.API_V1_STR
    )

    return app

app = create_application()

@app.on_event("startup")
async def startup():
    """
    应用启动时执行的操作
    """
    # 测试数据库连接
    test_connection()
    
    # 创建数据库表
    if settings.SHOULD_CREATE_TABLES:
        Base.metadata.create_all(bind=engine)
    
    # 初始化缓存
    if settings.USE_REDIS_CACHE:
        from fastapi_cache import FastAPICache
        from fastapi_cache.backends.redis import RedisBackend
        import aioredis
        
        redis = aioredis.from_url(settings.REDIS_URL)
        FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache:")

@app.on_event("shutdown")
async def shutdown():
    """
    应用关闭时执行的操作
    """
    # 关闭数据库连接池
    if engine:
        engine.dispose()

@app.get("/", tags=["Health Check"])
async def root():
    """
    API健康检查端点
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

@app.get("/ping", tags=["Health Check"])
async def ping():
    """
    数据库连接测试端点
    """
    try:
        test_connection()
        return {"status": "database connected"}
    except Exception as e:
        return {"status": "database connection failed", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        workers=settings.WORKERS_COUNT
    )