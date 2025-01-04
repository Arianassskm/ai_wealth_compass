# app/middleware/cors.py
from fastapi.middleware.cors import CORSMiddleware

def setup_cors_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # 在生产环境中应该指定具体域名
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )