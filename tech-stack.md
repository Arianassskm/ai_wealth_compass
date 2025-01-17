# 技术栈文档

## 前端技术栈

### 核心框架
- **React 18** 
  - 用于构建用户界面的 JavaScript 库
  - 采用 Function Components 和 Hooks
  - 使用 Suspense 和 Concurrent Mode 特性

- **Next.js 14**
  - React 框架，支持 SSR/SSG
  - App Router 和 Server Components
  - 内置路由和 API 功能

- **TypeScript 5**
  - 静态类型检查
  - 增强代码可维护性
  - 提供更好的 IDE 支持

### 状态管理
- **Redux Toolkit**
  - 全局状态管理
  - 内置 ImmerJS
  - 简化的异步操作处理

- **React Query v5**
  - 服务端状态管理
  - 自动缓存和重新验证
  - 优化数据请求

### UI 组件
- **Tailwind CSS**
  - 原子化 CSS 框架
  - JIT 编译
  - 响应式设计

- **Shadcn/ui**
  - 可定制组件库
  - 无样式组件
  - 主题系统

### 开发工具
- **ESLint**
  - 代码质量检查
  - TypeScript 规则集
  - 自动修复能力

- **Prettier**
  - 代码格式化
  - 统一代码风格
  - 编辑器集成

### 测试框架
- **Jest**
  - 单元测试
  - 快照测试
  - 覆盖率报告

- **React Testing Library**
  - 组件测试
  - 用户行为模拟
  - 可访问性测试

## 后端技术栈

### 运行时和框架
- **Node.js**
  - v20 LTS
  - ES Modules 支持
  - 性能优化

- **Nest.js**
  - TypeScript 优先
  - 模块化架构
  - 依赖注入

## 数据库方案

### LowDB
- **核心特性**
  - 基于 JSON 文件的轻量级数据库
  - 支持 TypeScript
  - 无需数据库服务器
  - 适合小型应用和原型开发

- **数据持久化**
  - JSON 文件存储
  - 自动写入
  - 数据备份

- **查询能力**
  - Lodash 式的链式查询
  - CRUD 操作
  - 数据过滤和排序


### ORM 和查询
- **Prisma**
  - 类型安全的 ORM
  - 数据库迁移
  - 自动生成类型

- **GraphQL**
  - Apollo Server
  - 类型定义
  - 实时订阅

### 认证和安全
- **NextAuth.js**
  - OAuth 集成
  - JWT 处理
  - 会话管理

- **bcrypt**
  - 密码加密
  - 安全哈希
  - 盐值处理

## DevOps 工具链

### 容器化和部署
- **Docker**
  - 多阶段构建
  - 容器编排
  - 开发环境一致性

- **GitHub Actions**
  - CI/CD 流程
  - 自动化测试
  - 自动部署

### 监控和日志
- **Sentry**
  - 错误追踪
  - 性能监控
  - 用户反馈

- **Winston**
  - 结构化日志
  - 多目标输出
  - 日志级别控制

## 性能优化

### 前端优化
- **代码分割**
  - 路由级别分割
  - 组件懒加载
  - 动态导入

- **资源优化**
  - 图片优化
  - 字体优化
  - 缓存策略

### 后端优化
- **数据库优化**
  - 索引优化
  - 查询优化
  - 连接池管理

- **缓存策略**
  - 多级缓存
  - 缓存预热
  - 缓存失效

## 代码质量保证

### 代码规范