import logging
from logging.handlers import RotatingFileHandler
import os
from pathlib import Path
from functools import lru_cache

# 创建日志目录结构
LOG_DIR = Path("logs")
DB_LOG_DIR = LOG_DIR / "db"
API_LOG_DIR = LOG_DIR / "api"
APP_LOG_DIR = LOG_DIR / "app"

# 创建所有日志目录
for dir in [LOG_DIR, DB_LOG_DIR, API_LOG_DIR, APP_LOG_DIR]:
    dir.mkdir(exist_ok=True, parents=True)

@lru_cache
def get_logger(name: str, log_file: str) -> logging.Logger:
    """
    获取指定名称的日志记录器
    
    Args:
        name: 日志记录器名称
        log_file: 日志文件路径
    """
    logger = logging.getLogger(name)
    
    if not logger.handlers:  # 避免重复添加处理器
        # 日志格式
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )

        # 文件处理器
        file_handler = RotatingFileHandler(
            log_file,
            maxBytes=10485760,  # 10MB
            backupCount=5,
            encoding='utf-8'
        )
        file_handler.setFormatter(formatter)
        file_handler.setLevel(logging.INFO)

        # 控制台处理器
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        console_handler.setLevel(logging.INFO)

        # 配置日志记录器
        logger.setLevel(logging.INFO)
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    return logger

# 预定义的日志记录器
db_logger = get_logger('db', DB_LOG_DIR / 'connection.log')
api_logger = get_logger('api', API_LOG_DIR / 'access.log')
app_logger = get_logger('app', APP_LOG_DIR / 'info.log') 