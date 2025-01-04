import time
from fastapi import Request
from fastapi.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # 请求日志
        logger.info(f"Request: {request.method} {request.url}")
        
        response = await call_next(request)
        
        # 响应时间日志
        process_time = time.time() - start_time
        logger.info(f"Response time: {process_time:.2f}s")
        
        return response