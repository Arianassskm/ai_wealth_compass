from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    # 基础配置
    PROJECT_NAME: str = "AI Wealth Compass"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    VERSION: str = "1.0.0"
    
    # 安全配置
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # PostgreSQL配置
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "1006"
    POSTGRES_DB: str = "wealth_management"
    POSTGRES_PORT: int = 5432
    
    # 数据库配置
    DATABASE_URL: str = "postgresql://postgres:1006@localhost:5432/wealth_management"
    SHOULD_CREATE_TABLES: bool = False
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    
    # CORS配置
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # Redis配置
    USE_REDIS_CACHE: bool = False
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_EXPIRE_MINUTES: int = 15
    
    # 服务器配置
    WORKERS_COUNT: int = 1
    
    # DeepSeek AI 配置
    DEEPSEEK_API_BASE_URL: str = "https://api.deepseek.com"
    DEEPSEEK_API_KEY: str = "sk-fc509a2abaf04f5f87803b4c3fef56fd"
    DEEPSEEK_MODEL: str = "deepseek-chat"
    
    # AI 请求配置
    AI_REQUEST_TIMEOUT: int = 30
    AI_MAX_RETRIES: int = 3
    AI_STREAM_MODE: bool = False
    
    # AI 模型参数
    AI_TEMPERATURE: float = 0.7
    AI_MAX_TOKENS: Optional[int] = None
    
    # 风险控制配置
    MAX_DAILY_TRANSACTION_AMOUNT: float = 1000000
    MAX_PORTFOLIO_ADJUSTMENT_PERCENTAGE: float = 20.0
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True
        
        # 环境变量映射
        fields = {
            "POSTGRES_SERVER": {
                "env": "POSTGRES_SERVER",
                "description": "PostgreSQL服务器地址"
            },
            "POSTGRES_USER": {
                "env": "POSTGRES_USER",
                "description": "PostgreSQL用户名"
            },
            "POSTGRES_PASSWORD": {
                "env": "POSTGRES_PASSWORD",
                "description": "PostgreSQL密码"
            },
            "POSTGRES_DB": {
                "env": "POSTGRES_DB",
                "description": "PostgreSQL数据库名"
            },
            "POSTGRES_PORT": {
                "env": "POSTGRES_PORT",
                "description": "PostgreSQL端口"
            },
            "DATABASE_URL": {
                "env": "DATABASE_URL",
                "description": "数据库连接URL"
            },
            "REDIS_URL": {
                "env": "REDIS_URL",
                "description": "Redis连接URL"
            },
            "USE_REDIS_CACHE": {
                "env": "USE_REDIS_CACHE",
                "description": "是否启用Redis缓存"
            },
            "ENVIRONMENT": {
                "env": "ENVIRONMENT",
                "description": "运行环境"
            },
            "DEBUG": {
                "env": "DEBUG",
                "description": "调试模式"
            },
            "SHOULD_CREATE_TABLES": {
                "env": "SHOULD_CREATE_TABLES",
                "description": "是否创建数据库表"
            },
            "DEEPSEEK_API_KEY": {
                "env": "DEEPSEEK_API_KEY",
                "description": "DeepSeek API密钥"
            },
            "DEEPSEEK_API_BASE_URL": {
                "env": "DEEPSEEK_API_BASE_URL",
                "description": "DeepSeek API基础URL"
            },
            "VERSION": {
                "env": "VERSION",
                "description": "API版本号"
            },
            "DB_POOL_SIZE": {
                "env": "DB_POOL_SIZE",
                "description": "数据库连接池大小"
            },
            "DB_MAX_OVERFLOW": {
                "env": "DB_MAX_OVERFLOW",
                "description": "数据库最大溢出连接数"
            },
            "CACHE_EXPIRE_MINUTES": {
                "env": "CACHE_EXPIRE_MINUTES",
                "description": "缓存过期时间（分钟）"
            },
            "MAX_DAILY_TRANSACTION_AMOUNT": {
                "env": "MAX_DAILY_TRANSACTION_AMOUNT",
                "description": "每日最大交易金额"
            },
            "MAX_PORTFOLIO_ADJUSTMENT_PERCENTAGE": {
                "env": "MAX_PORTFOLIO_ADJUSTMENT_PERCENTAGE",
                "description": "投资组合最大调整百分比"
            }
        }

settings = Settings()