from fastapi import FastAPI
from app.db.session import engine, Base
from backend.scripts.test_connection import test_connection

app = FastAPI()

@app.on_event("startup")
async def startup():
    # 测试数据库连接
    test_connection()
    
    # 如果需要创建表(如果不存在)
    # Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "API 运行正常"}