# backend/app/db/test_connection.py
import asyncio
from sqlalchemy import text
from app.db.session import engine
from app.core.logging import db_logger

async def test_connection():
    try:
        # 测试连接
        async with engine.connect() as connection:
            result = await connection.scalar(text("SELECT version()"))
            db_logger.info("✅ 数据库连接成功！")
            db_logger.info(f"PostgreSQL 版本: {result}")
            return True
    except Exception as e:
        db_logger.error("❌ 数据库连接失败！")
        db_logger.error(f"错误信息: {str(e)}")
        raise e

if __name__ == "__main__":
    asyncio.run(test_connection())