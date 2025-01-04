from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer
from .utils import decode_jwt

class AuthMiddleware(HTTPBearer):
    async def __call__(self, request: Request):
        credentials = await super().__call__(request)
        if not credentials:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")
        token = credentials.credentials
        user = decode_jwt(token)
        request.state.user = user
        return credentials