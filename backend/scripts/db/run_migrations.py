import subprocess
from pathlib import Path
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime
import sys

# 修改导入方式
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir.parent.parent))

# 现在导入 set_env
from scripts.db.set_env import setup_env
setup_env()

# 设置日志
log_dir = Path("backend/logs/db")
log_dir.mkdir(parents=True, exist_ok=True)
log_file = log_dir / "migrations.log"

logger = logging.getLogger("db_migrations")
logger.setLevel(logging.INFO)

# 文件处理器
file_handler = RotatingFileHandler(
    log_file,
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5,
    encoding='utf-8'
)
file_handler.setFormatter(
    logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
)
logger.addHandler(file_handler)

def run_migrations(target="head"):
    try:
        # 记录开始
        logger.info(f"开始执行迁移到: {target}")
        
        # 获取当前版本
        current = subprocess.run(
            ["alembic", "current"],
            capture_output=True,
            text=True,
            check=True
        )
        current_version = current.stdout.strip()
        logger.info(f"当前版本: {current_version}")
        
        # 执行迁移
        result = subprocess.run(
            ["alembic", "upgrade", target],
            capture_output=True,
            text=True,
            check=True
        )
        
        # 记录成功
        logger.info("迁移成功完成")
        logger.info(f"输出: {result.stdout}")
        
        print("✅ 数据库迁移成功！")
        print(result.stdout)
        
    except subprocess.CalledProcessError as e:
        error_msg = f"数据库迁移失败: {e.stderr}"
        logger.error(error_msg)
        
        # 尝试回滚
        try:
            logger.info("尝试回滚到之前版本")
            subprocess.run(
                ["alembic", "downgrade", "-1"],
                check=True
            )
            logger.info("回滚成功")
            print("✅ 已自动回滚到之前版本")
        except:
            logger.error("回滚失败")
            print("❌ 回滚失败，请手动检查数据库状态")
        
        print(f"❌ {error_msg}")
        
    except Exception as e:
        error_msg = f"发生错误: {str(e)}"
        logger.error(error_msg)
        print(f"❌ {error_msg}")

if __name__ == "__main__":
    # 支持指定目标版本
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else "head"
    run_migrations(target) 