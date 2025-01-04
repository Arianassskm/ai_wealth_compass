# app/middleware/error.py
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.base import BaseHTTPMiddleware

class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except HTTPException as e:
            return JSONResponse(
                status_code=e.status_code,
                content={"message": e.detail}
            )
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"message": "Internal server error"}
            )