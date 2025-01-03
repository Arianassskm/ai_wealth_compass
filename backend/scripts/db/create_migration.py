import sys
import subprocess
from pathlib import Path
import logging
from logging.handlers import RotatingFileHandler

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

def create_migration():
    try:
        # 获取迁移消息和描述
        if len(sys.argv) < 2:
            print("❌ 请提供迁移说明！")
            print("用法: python scripts/db/create_migration.py <message> [description]")
            return
        
        message = sys.argv[1]
        description = sys.argv[2] if len(sys.argv) > 2 else ""
        
        # 记录开始
        logger.info(f"开始创建迁移: {message}")
        
        # 执行 alembic revision 命令
        result = subprocess.run(
            ["alembic", "revision", "--autogenerate", "-m", message],
            capture_output=True,
            text=True,
            check=True
        )
        
        # 获取新创建的迁移文件路径
        versions_dir = Path("backend/alembic/versions")
        migration_files = list(versions_dir.glob("*_*.py"))
        latest_migration = max(migration_files, key=lambda x: x.stat().st_mtime)
        
        # 添加描述到迁移文件
        if description:
            content = latest_migration.read_text()
            description_text = f'"""\n{description}\n\n' + content.split('"""', 1)[1]
            latest_migration.write_text(description_text)
        
        # 记录成功
        logger.info(f"迁移文件创建成功: {latest_migration.name}")
        logger.info(f"描述: {description}")
        
        print("✅ 迁移文件创建成功！")
        print(f"文件: {latest_migration.name}")
        print(result.stdout)
        
    except subprocess.CalledProcessError as e:
        error_msg = f"迁移文件创建失败: {e.stderr}"
        logger.error(error_msg)
        print(f"❌ {error_msg}")
        
    except Exception as e:
        error_msg = f"发生错误: {str(e)}"
        logger.error(error_msg)
        print(f"❌ {error_msg}")

if __name__ == "__main__":
    create_migration() 