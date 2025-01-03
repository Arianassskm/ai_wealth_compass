# AI预见式财富管理系统 - 架构设计文档

## 一、系统架构概览

### 1. 技术栈选择

#### 前端技术栈
- Next.js 13+ (React框架)
- TailwindCSS (样式框架)
- shadcn/ui (UI组件库)
- SWR/React Query (数据获取)
- Zustand (状态管理)

#### 后端技术栈
- FastAPI (Python Web框架)
- PostgreSQL (关系型数据库)
- SQLAlchemy (ORM)
- Pydantic (数据验证)
- OpenAI API (AI模型集成)

#### 部署和运维
- Docker (容器化)
- Nginx (反向代理)
- Redis (缓存)

### 2. 系统架构图

```mermaid
graph TD
    subgraph Frontend
        UI[用户界面]
        State[状态管理]
        API_Client[API客户端]
    end

    subgraph Backend
        API_Server[FastAPI服务器]
        Auth[认证服务]
        AI_Service[AI服务]
        DB_Service[数据库服务]
    end

    subgraph Database
        PostgreSQL[(PostgreSQL)]
        Redis[(Redis缓存)]
    end

    UI --> State
    State --> API_Client
    API_Client --> API_Server
    API_Server --> Auth
    API_Server --> AI_Service
    API_Server --> DB_Service
    DB_Service --> PostgreSQL
    DB_Service --> Redis
```

## 二、数据流设计

### 1. 前端到数据库的数据流

```mermaid
sequenceDiagram
    participant U as 用户界面
    participant F as 前端状态
    participant A as API层
    participant B as 业务层
    participant D as 数据库

    U->>F: 用户操作
    F->>A: API请求
    A->>B: 业务处理
    B->>D: 数据操作
    D-->>B: 返回结果
    B-->>A: 处理响应
    A-->>F: 更新状态
    F-->>U: 更新界面
```

### 2. API接入方式

#### 前端接入
```typescript
// api/client.ts
import { createClient } from '@/lib/api-client';

const apiClient = createClient({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 用户相关API
export const userApi = {
    getCurrentUser: () => apiClient.get('/users/me'),
    updateProfile: (data) => apiClient.put('/users/profile', data),
    // ...其他用户相关接口
};

// 预警系统API
export const warningApi = {
    getThresholds: () => apiClient.get('/warnings/thresholds'),
    updateThreshold: (id, data) => apiClient.put(\`/warnings/thresholds/\${id}\`, data),
    // ...其他预警相关接口
};

// 守护模式API
export const guardianApi = {
    getSettings: () => apiClient.get('/guardian/settings'),
    updateSettings: (id, data) => apiClient.put(\`/guardian/settings/\${id}\`, data),
    // ...其他守护模式相关接口
};
```

#### 后端接入
```python
# database/connection.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "postgresql://user:password@localhost/dbname"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 依赖注入
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# models/user.py
from sqlalchemy import Column, Integer, String, DateTime
from database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    # ...其他字段

# routes/user.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from models.user import User

router = APIRouter()

@router.get("/users/me")
def get_current_user(db: Session = Depends(get_db)):
    # 获取当前用户逻辑
    pass

@router.put("/users/profile")
def update_user_profile(data: dict, db: Session = Depends(get_db)):
    # 更新用户资料逻辑
    pass
```

## 三、数据库关系图

```mermaid
erDiagram
    users ||--o{ user_profiles : has
    users ||--o{ warning_thresholds : sets
    users ||--o{ warning_logs : triggers
    users ||--o{ guardian_mode_settings : configures
    
    warning_thresholds ||--o{ warning_logs : generates
    warning_logs ||--o{ warning_ai_suggestions : receives
    
    guardian_mode_settings ||--o{ guardian_mode_logs : triggers
    guardian_mode_logs ||--o{ guardian_mode_ai_suggestions : receives
    
    users ||--o{ consumption_decisions : makes
    users ||--o{ ai_interactions : has
```

## 四、安全设计

### 1. 认证和授权
- JWT token认证
- 基于角色的访问控制（RBAC）
- API请求限流

### 2. 数据安全
- 密码加密存储
- 敏感数据加密
- HTTPS传输
- SQL注入防护

### 3. 审计日志
- 用户操作日志
- 系统错误日志
- 性能监控日志

## 五、缓存策略

### 1. Redis缓存层
- 用户会话信息
- 频繁访问的配置数据
- API响应缓存

### 2. 前端缓存
- SWR数据缓存
- 本地存储
- 状态持久化
