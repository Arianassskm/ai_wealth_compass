import os
import sys
from pathlib import Path

def setup_env():
    """设置环境变量和Python路径"""
    # 获取项目根目录
    root_dir = Path(__file__).parent.parent.parent
    
    # 将项目根目录添加到 PYTHONPATH
    if str(root_dir) not in sys.path:
        sys.path.insert(0, str(root_dir))
    
    # 设置环境变量
    os.environ["PYTHONPATH"] = str(root_dir)
    
    return root_dir 