# AI预见式财富管理系统 API文档 📚

## 基础信息

| 项目 | 说明 |
|------|------|
| 基础URL | `/api/v1` |
| 认证方式 | Bearer Token |
| 响应格式 | JSON |
| 时间格式 | ISO 8601 |
| 金额单位 | 人民币元 |

## API 端点

### 1. 用户认证 🔐

#### 登录
```http
POST /auth/login
```

请求体:
```json
{
    "email": "user@example.com",
    "password": "your_password"
}
```

响应:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "username": "张三",
        "email": "user@example.com"
    }
}
```

### 2. 用户画像 👤

#### 获取用户画像
```http
GET /users/profile
```

响应:
```json
{
    "age_group": "25-35",
    "financial_status": "stable",
    "risk_preference": "moderate",
    "estimated_monthly_income": 15000,
    "estimated_monthly_expenses": 10000,
    "ai_confidence_score": 0.85
}
```

### 3. 财务分析 📊

#### 获取财务概览
```http
GET /finance/overview
```

响应:
```json
{
    "total_assets": 100000,
    "monthly_income": 15000,
    "monthly_expenses": 10000,
    "savings_rate": 0.33,
    "financial_health_score": 85
}
```

### 4. 投资管理 💰

#### 获取投资组合
```http
GET /investments/portfolio
```

响应:
```json
{
    "total_value": 100000,
    "components": [
        {
            "id": 1,
            "name": "固定资产",
            "value": 50000,
            "component_type": "fixed_asset",
            "icon": "Building",
            "percentage": 50,
            "risk_level": "low",
            "return_rate": 3.5
        }
    ],
    "statistics": {
        "monthly_return": 2.5,
        "risk_score": 3.2,
        "diversity_score": 0.8
    }
}
```

#### 更新投资组合
```http
PUT /investments/portfolio/{portfolio_id}
```

请求体:
```json
{
    "name": "保守型投资组合",
    "risk_level": "low",
    "target_return": 5.0,
    "investment_horizon": "long_term",
    "portfolio_data": {
        "bonds": 60,
        "stocks": 30,
        "cash": 10
    }
}
```

### 5. 预算管理 📒

#### 获取预算列表
```http
GET /budgets?month=2024-03
```

响应:
```json
{
    "total_budget": 10000,
    "categories": [
        {
            "id": 1,
            "name": "生活必需",
            "planned_amount": 5000,
            "spent_amount": 3500,
            "remaining": 1500,
            "percentage": 70,
            "status": "normal"
        }
    ],
    "statistics": {
        "total_spent": 7500,
        "total_remaining": 2500,
        "health_score": 85
    }
}
```

#### 创建预算类别
```http
POST /budgets/categories
```

请求体:
```json
{
    "name": "娱乐支出",
    "planned_amount": 1000,
    "thresholds": {
        "warning": 800,
        "critical": 950
    },
    "notification_enabled": true
}
```

### 6. 目标追踪 🎯

#### 获取财务目标列表
```http
GET /goals
```

响应:
```json
{
    "goals": [
        {
            "id": 1,
            "name": "购房首付",
            "target_amount": 500000,
            "current_amount": 200000,
            "deadline": "2025-12-31",
            "progress": 40,
            "status": "on_track",
            "monthly_required": 15000
        }
    ],
    "statistics": {
        "total_goals": 3,
        "completed_goals": 1,
        "average_progress": 45
    }
}
```

### 7. AI 分析服务 🤖

#### 获取智能建议
```http
GET /ai/advice?type=investment
```

响应:
```json
{
    "advice_id": "adv_123",
    "type": "investment",
    "recommendations": [
        {
            "title": "调整资产配置",
            "content": "建议增加10%的固定收益类资产",
            "reason": "当前市场波动较大，适当增加稳定性资产",
            "confidence_score": 0.85,
            "priority": "high"
        }
    ],
    "market_analysis": {
        "market_condition": "volatile",
        "risk_level": "medium",
        "opportunity_score": 0.7
    }
}
```

#### 请求消费决策分析
```http
POST /ai/analysis/consumption
```

请求体:
```json
{
    "amount": 5000,
    "category": "electronics",
    "urgency_level": "medium",
    "user_context": {
        "monthly_income": 15000,
        "savings_goal": 3000,
        "existing_debts": 0
    }
}
```

### 8. 通知系统 🔔

#### 获取通知列表
```http
GET /notifications?status=unread
```

响应:
```json
{
    "total_count": 5,
    "unread_count": 3,
    "notifications": [
        {
            "id": "notif_123",
            "type": "budget_alert",
            "title": "预算超支提醒",
            "content": "您的娱乐支出类别已达到预警阈值",
            "created_at": "2024-03-15T08:00:00Z",
            "read_status": false,
            "priority": "high"
        }
    ]
}
```

#### 更新通知设置
```http
PUT /notifications/settings
```

请求体:
```json
{
    "channels": {
        "email": true,
        "push": true,
        "sms": false
    },
    "preferences": {
        "budget_alerts": "immediate",
        "investment_updates": "daily",
        "goal_progress": "weekly"
    }
}
```

### 9. 系统设置 ⚙️

#### 获取用户设置
```http
GET /settings
```

响应:
```json
{
    "language": "zh_CN",
    "currency": "CNY",
    "timezone": "Asia/Shanghai",
    "theme": "light",
    "privacy": {
        "data_sharing": false,
        "anonymous_analytics": true
    },
    "features": {
        "ai_assistant": true,
        "investment_tracking": true,
        "budget_planning": true
    }
}
```

### 10. 错误处理 ❌

所有 API 在发生错误时将返回统一格式的错误响应：

```json
{
    "error": {
        "code": "ERROR_CODE",
        "message": "错误描述信息",
        "details": {
            "field": "具体错误字段",
            "reason": "具体错误原因"
        }
    }
}
```

#### 常见错误代码

| 错误代码 | HTTP状态码 | 说明 |
|---------|------------|------|
| AUTH_FAILED | 401 | 认证失败 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| VALIDATION_ERROR | 422 | 请求数据验证失败 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

### 11. 速率限制 🚦

| API类型 | 限制 |
|---------|------|
| 认证接口 | 10次/分钟 |
| 普通接口 | 60次/分钟 |
| AI分析接口 | 30次/分钟 |

超出限制时将返回 429 状态码：

```json
{
    "error": {
        "code": "RATE_LIMIT_EXCEEDED",
        "message": "请求过于频繁，请稍后再试",
        "reset_time": "2024-03-15T08:01:00Z"
    }
}
```

## 最佳实践 ✨

### 请求频率限制
| API类型 | 限制 |
|---------|------|
| 普通接口 | 60次/分钟 |
| 分析接口 | 30次/分钟 |

### 数据缓存
| 数据类型 | 缓存时间 |
|----------|----------|
| 分析结果 | 5分钟 |
| 基础数据 | 30分钟 |

### 安全建议 🔒
- ✅ 使用HTTPS
- 🔄 定期更换访问令牌
- 🔐 敏感数据加密传输
