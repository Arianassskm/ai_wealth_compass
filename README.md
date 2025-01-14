# AI预见式财富管家

基于人工智能的个人财富管理系统，为用户提供智能化的财务决策支持和财富管理服务。

## 功能特点

### 1. 智能决策支持
- 基于AI的财务决策分析
- 个性化投资建议
- 风险评估和预警
- 智能预算管理
- 消费决策辅助
- 职业发展规划

### 2. 财务分析与追踪
- 收支分析与可视化
- 预算执行监控
- 投资组合分析
- 财务健康评估
- 资产配置优化
- 理财目标追踪

### 3. 个性化AI助手
- 24/7智能客服
- 个性化理财建议
- 实时市场分析
- 财务知识普及
- 投资风险提醒
- 消费决策建议

## AI 功能特点

### 1. AI 模型集成
- 使用 DeepSeek-Chat 模型
- API 版本: v1
- 响应格式: JSON
- 支持异步调用
- 实时数据分析
- 智能决策支持

### 2. AI 智能决策支持
- 基于 DeepSeek 的财务决策分析
- 个性化投资建议生成
- 智能风险评估和预警
- 实时市场分析
- 资产配置建议
- 消费决策辅助

### 3. AI 助手功能
- 24/7 智能客服支持
- 个性化理财建议
- 投资策略分析
- 财务知识普及
- 风险提醒
- 市场趋势分析

### 4. AI 分析能力
- 用户画像分析
- 投资组合评估
- 风险偏好分析
- 市场趋势预测
- 消费模式分析
- 财务健康评估

## 技术栈

### 前端
- Next.js 14
- TypeScript
- TailwindCSS
- Shadcn UI
- Zustand
- Framer Motion
- Recharts
- Radix UI

### 后端
- FastAPI (Python Web框架)
- PostgreSQL (关系型数据库)
- SQLAlchemy (ORM)
- Pydantic (数据验证)
- DeepSeek API (AI模型集成)
- Redis (缓存和消息队列)
- Celery (异步任务处理)
- JWT (认证授权)

### AI 服务
- DeepSeek API
- 异步 HTTP 客户端 (httpx)
- 自定义提示词模板
- JSON 响应处理
- WebSocket 实时通信
- 事件驱动架构

### DevOps
- Docker
- Nginx
- Redis
- PostgreSQL
- Prometheus
- Grafana

## 项目结构
```
.
├── frontend/           # Next.js前端
│   ├── app/           # 页面组件
│   │   ├── page.tsx   # 首页
│   │   ├── wealth-development/
│   │   ├── investment-analysis/
│   │   ├── credit-analysis/
│   │   └── career-development/
│   ├── components/    # 可复用组件
│   ├── lib/          # 工具函数
│   └── public/       # 静态资源
│
backend/
├── app/
│   ├── ai/          # AI 相关功能
│   │   ├── client.py
│   │   └── models/
│   ├── api/         # API 路由
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   └── api.py
│   │   └── deps.py
│   ├── auth/        # 认证相关
│   ├── core/        # 核心配置
│   │   ├── config.py
│   │   ├── security.py
│   │   └── errors.py
│   ├── crud/        # 数据库操作
│   ├── database/    # 数据库配置
│   ├── middleware/  # 中间件
│   │   ├── logging.py
│   │   └── error.py
│   ├── models/      # 数据模型
│   ├── schemas/     # Pydantic模型
│   ├── services/    # 业务逻辑
│   │   ├── user_service.py
│   │   ├── profile_service.py
│   │   ├── prediction_service.py
│   │   └── algorithm_service.py
│   ├── utils/       # 工具函数
│   └── main.py      # 应用入口
├── tests/           # 测试文件
└── venv/            # 虚拟环境

└── docs/             # 项目文档
    ├── API.md         # API接口文档
    ├── ARCHITECTURE.md # 系统架构设计文档
    ├── PAGES.md       # 页面路由说明
    ├── PROJECT_STATUS.md # 项目开发状态
    └── SCHEMA.md      # 数据库模式设计
```

## 开发环境设置

1. **前端开发**
```bash
cd frontend
npm install
npm run dev
```

2. **后端开发**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

3. **数据库设置**
```bash
createdb ai_wealth_management
cd backend
alembic upgrade head
```

4. **Redis设置**
```bash
# 安装Redis
# 启动Redis服务
redis-server

# 测试Redis连接
redis-cli ping
```

5. **环境变量配置**
```bash
# 创建.env文件
cp .env.example .env
# 编辑.env文件设置必要的环境变量
```

## API文档
- FastAPI Swagger文档: http://localhost:8000/docs
- FastAPI ReDoc文档: http://localhost:8000/redoc

## 部署
项目使用Docker容器化部署，包含以下服务：
- Frontend (Next.js)
- Backend (FastAPI)
- PostgreSQL
- Redis
- Nginx
- Celery Worker
- Prometheus
- Grafana

## 开发规范

### 代码风格
- 使用ESLint和Prettier (前端)
- 使用Python Black格式化工具 (后端)
- 遵循TypeScript严格模式
- 遵循PEP 8规范 (Python)

### Git提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 监控与日志
- Prometheus用于指标收集
- Grafana用于可视化监控
- ELK Stack用于日志管理
- 自定义中间件用于请求追踪

## 许可证
MIT License
