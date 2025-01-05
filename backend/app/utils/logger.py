"""日志管理模块"""
import logging
from logging.handlers import RotatingFileHandler

# 配置日志
logger = logging.getLogger("wealth_compass")
logger.setLevel(logging.INFO)

# 添加控制台处理器
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
logger.addHandler(console_handler)

# 添加文件处理器
file_handler = RotatingFileHandler(
    "logs/app.log",
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)
file_handler.setLevel(logging.INFO)
logger.addHandler(file_handler) 