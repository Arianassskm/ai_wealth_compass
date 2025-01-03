import subprocess
import sys
import os
from datetime import datetime
import shutil

def generate_requirements():
    try:
        req_file = 'requirements.txt'
        
        # 如果文件已存在，创建备份
        if os.path.exists(req_file):
            backup_name = f'requirements_{datetime.now().strftime("%Y%m%d_%H%M%S")}.bak'
            shutil.copy2(req_file, backup_name)
            print(f"✅ 已创建备份文件: {backup_name}")
        
        # 使用 pip freeze 命令
        result = subprocess.run(
            [sys.executable, '-m', 'pip', 'freeze'],
            capture_output=True,
            text=True,
            check=True
        )
        
        # 过滤掉不需要的包
        requirements = [
            line for line in result.stdout.split('\n')
            if line and not line.startswith(('pip==', 'setuptools==', 'wheel=='))
        ]
        
        # 写入新文件
        with open(req_file, 'w') as f:
            f.write('\n'.join(sorted(requirements)))
            f.write('\n')
            
        print(f"✅ {req_file} 已成功更新！")
        
    except Exception as e:
        print(f"❌ 生成失败：{str(e)}")

if __name__ == '__main__':
    generate_requirements() 