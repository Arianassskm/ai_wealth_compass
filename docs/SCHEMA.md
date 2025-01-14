# 数据库设计文档

## 数据库表概览

| 序号 | Schema | Name | Type | 说明 |
|------|--------|------|------|------|
| 1 | public | achievements | table | 成就表 |
| 2 | public | ai_analysis_history | table | AI分析历史 |
| 3 | public | ai_chat_history | table | AI聊天历史 |
| 4 | public | ai_chat_sessions | table | AI会话 |
| 5 | public | ai_estimated_budgets | table | AI预算估算 |
| 6 | public | alembic_version | table | 数据库版本控制 |
| 7 | public | alert_records | partitioned table | 预警记录 |
| 8 | public | alert_records_y2024m01 | table | 预警记录分区表 |
| 9 | public | alert_rules | table | 预警规则 |
| 10 | public | asset_changes | partitioned table | 资产变动 |
| 11 | public | asset_changes_y2024m01 | table | 资产变动分区表 |
| 12 | public | assets | table | 资产 |
| 13 | public | budgets | table | 预算 |
| 14 | public | consumption_decisions | partitioned table | 消费决策 |
| 15 | public | consumption_decisions_y2024m01 | table | 消费决策分区表 |
| 16 | public | equivalence_conversions | table | 等价转换 |
| 17 | public | expert_analysis | table | 专家分析 |
| 18 | public | expert_models | table | 专家模型 |
| 19 | public | financial_goals | table | 财务目标 |
| 20 | public | goal_adjustment_history | table | 目标调整历史 |
| 21 | public | investment_returns | table | 投资回报 |
| 22 | public | life_stages | table | 生命阶段 |
| 23 | public | notification_history | table | 通知历史 |
| 24 | public | notification_settings | table | 通知设置 |
| 25 | public | payment_methods | table | 支付方式 |
| 26 | public | persona_templates | table | 人设模板 |
| 27 | public | portfolios | table | 投资组合 |
| 28 | public | transactions | table | 交易记录 |
| 29 | public | user_achievements | table | 用户成就 |
| 30 | public | user_alerts | table | 用户预警 |
| 31 | public | user_goals | table | 用户目标 |
| 32 | public | user_personas | table | 用户人设 |
| 33 | public | user_preferences | table | 用户偏好 |
| 34 | public | user_profiles | table | 用户档案 |
| 35 | public | user_settings | table | 用户设置 |
| 36 | public | users | table | 用户表 |
| 37 | public | wealth_components | table | 财富组成 |
| 38 | public | wealth_snapshots | table | 财富快照 |

## 前端数据逻辑流程

### 用户画像流程
1. 用户注册/登录 
2. 选择生命阶段 
3. 选择人设模板 
4. AI结合算法生成初始财务画像，并自动生成所有前端显示内容。models里面的algorithm 和AI 和user文件夹
5. 当用户在预算设置、反向财富管理、财富构成、财务目标等操作时，AI会校准更新用户画像，并自动生成所有前端显示内容。

### 消费决策流程
1. 输入消费金额和类别 
2. 获取等价物换算 
3. 计算财务影响 
4. 生成建议 
5. 展示可视化结果

### AI助手（接入大模型）
1. 聊天助手
2. 人情往来、投资分析、提前消费、财富开发

### 预警系统流程
1. 定期检查财务状况 
2. AI结合算法计算多维度预警等级 
3. 生成建议 
4. 推送通知

## 表格结构组成

### 1. 用户系统相关表
- users (用户核心表)
  - 基础信息维持不变
  - 用户状态字段 (status)
  - 用户类型字段 (user_type)
  - 最后登录时间 (last_login)
- user_settings (用户设置表)
  - 用户偏好配置
  - 系统设置

### 2. 生命阶段体系相关表
- life_stages (生命阶段表)
  - 阶段类型枚举
  - 阶段特征
  - 默认配置
  - 过渡期标识
- persona_templates (人设模板表)
  - 模板配置
  - 适用条件

### 3. 资产管理相关表
- assets (资产主表)
  - 资产类型
  - 资产状态
  - 变动追踪
  - 评估记录
- asset_changes (资产变动记录表)
  - 变动明细
  - 变动原因

### 4. 消费决策相关表
- consumption_decisions (消费决策表)
  - 决策状态
  - 影响评估
  - 参考因素
  - 后续追踪
- equivalence_conversions (等价转换表)
  - 转换规则
  - 参考单位

### 5. 预警系统相关表
- alert_rules (预警规则表)
  - 规则类型
  - 阈值设置
  - 触发条件
  - 响应动作
- alert_records (预警记录表)
  - 触发记录
  - 处理状态

### 6. 游戏化系统相关表
- achievements (成就表)
  - 成就类型
  - 达成条件
  - 奖励设置
- user_achievements (用户成就记录表)
  - 达成进度
  - 完成时间

## 表结构详情

### 1. achievements (成就表)


## 表结构详情

### 1. achievements (成就表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('achievements_id_seq'::regclass) | 主键 |
| name | varchar(100) | 否 | | 成就名称 |
| description | text | 否 | | 成就描述 |
| category | varchar(50) | 否 | | 成就类别 |
| conditions | jsonb | 否 | | 达成条件 |
| reward_points | integer | 否 | 0 | 奖励积分 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "achievements_pkey" PRIMARY KEY, btree (id)
- "idx_achievements_category" btree (category)



## 表结构详情

### 1. achievements (成就表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('achievements_id_seq'::regclass) | 主键 |
| name | varchar(100) | 否 | | 成就名称 |
| description | text | 否 | | 成就描述 |
| category | varchar(50) | 否 | | 成就类别 |
| conditions | jsonb | 否 | | 达成条件 |
| reward_points | integer | 否 | 0 | 奖励积分 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "achievements_pkey" PRIMARY KEY, btree (id)
- "idx_achievements_category" btree (category)

### 2. ai_analysis_history (AI分析历史表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('ai_analysis_history_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| analysis_type | varchar(50) | 否 | | 分析类型 |
| input_data | jsonb | 否 | | 输入数据 |
| output_data | jsonb | 否 | | 输出数据 |
| model_version | varchar(50) | 是 | | 模型版本 |
| confidence_score | numeric(5,2) | 是 | | 置信度 |
| execution_time | integer | 是 | | 执行时间(ms) |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "ai_analysis_history_pkey" PRIMARY KEY, btree (id)
- "idx_ai_analysis_history_user" btree (user_id)
- "idx_ai_analysis_history_type" btree (analysis_type)

外键约束：
- "ai_analysis_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 3. ai_chat_history (AI聊天历史表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('ai_chat_history_id_seq'::regclass) | 主键 |
| session_id | integer | 否 | | 会话ID |
| user_id | integer | 否 | | 用户ID |
| role | varchar(20) | 否 | | 角色(user/assistant) |
| content | text | 否 | | 消息内容 |
| tokens | integer | 是 | | token数量 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "ai_chat_history_pkey" PRIMARY KEY, btree (id)
- "idx_ai_chat_history_session" btree (session_id)
- "idx_ai_chat_history_user" btree (user_id)

外键约束：
- "ai_chat_history_session_id_fkey" FOREIGN KEY (session_id) REFERENCES ai_chat_sessions(id)
- "ai_chat_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 4. ai_chat_sessions (AI会话表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('ai_chat_sessions_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| title | varchar(255) | 是 | | 会话标题 |
| session_type | varchar(50) | 否 | | 会话类型 |
| status | varchar(20) | 否 | 'active' | 会话状态 |
| context | jsonb | 是 | | 会话上下文 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "ai_chat_sessions_pkey" PRIMARY KEY, btree (id)
- "idx_ai_chat_sessions_user" btree (user_id)
- "idx_ai_chat_sessions_type" btree (session_type)

外键约束：
- "ai_chat_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 5. ai_estimated_budgets (AI预算估算表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('ai_estimated_budgets_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| budget_type | varchar(50) | 否 | | 预算类型 |
| amount | numeric(15,2) | 否 | | 估算金额 |
| confidence_score | numeric(5,2) | 是 | | 置信度 |
| parameters | jsonb | 是 | | 估算参数 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "ai_estimated_budgets_pkey" PRIMARY KEY, btree (id)
- "idx_ai_estimated_budgets_user" btree (user_id)

外键约束：
- "ai_estimated_budgets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 6. alembic_version (数据库版本控制表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| version_num | varchar(32) | 否 | | 版本号 |

索引：
- "alembic_version_pkc" PRIMARY KEY, btree (version_num)

### 7. alert_records (预警记录表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('alert_records_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| alert_rule_id | integer | 否 | | 预警规则ID |
| trigger_time | timestamp with time zone | 否 | | 触发时间 |
| alert_data | jsonb | 否 | | 预警数据 |
| status | varchar(20) | 否 | 'pending' | 状态 |
| resolution | text | 是 | | 解决方案 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

分区说明：
- 按月分区
- 子表: alert_records_y2024m01

索引：
- "alert_records_pkey" PRIMARY KEY, btree (id)
- "idx_alert_records_user" btree (user_id)
- "idx_alert_records_rule" btree (alert_rule_id)
- "idx_alert_records_time" btree (trigger_time)

外键约束：
- "alert_records_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
- "alert_records_alert_rule_id_fkey" FOREIGN KEY (alert_rule_id) REFERENCES alert_rules(id)

### 8. alert_records_y2024m01 (预警记录分区表)
继承自 alert_records 表
分区范围：FROM ('2024-01-01') TO ('2024-02-01')

### 12. assets (资产表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('assets_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| asset_name | varchar(100) | 否 | | 资产名称 |
| asset_type | varchar(50) | 否 | | 资产类型 |
| current_value | numeric(15,2) | 否 | | 当前价值 |
| currency | varchar(10) | 否 | 'CNY' | 货币类型 |
| acquisition_date | date | 是 | | 获取日期 |
| acquisition_value | numeric(15,2) | 是 | | 获取价值 |
| status | varchar(20) | 否 | 'active' | 资产状态 |
| metadata | jsonb | 是 | | 元数据 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "assets_pkey" PRIMARY KEY, btree (id)
- "idx_assets_user" btree (user_id)
- "idx_assets_type" btree (asset_type)

外键约束：
- "assets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 13. budgets (预算表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('budgets_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| budget_name | varchar(100) | 否 | | 预算名称 |
| budget_type | varchar(50) | 否 | | 预算类型 |
| amount | numeric(15,2) | 否 | | 预算金额 |
| start_date | date | 否 | | 开始日期 |
| end_date | date | 否 | | 结束日期 |
| category | varchar(50) | 否 | | 预算类别 |
| recurrence | varchar(20) | 是 | | 重复周期 |
| alert_threshold | numeric(5,2) | 是 | | 预警阈值 |
| status | varchar(20) | 否 | 'active' | 预算状态 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "budgets_pkey" PRIMARY KEY, btree (id)
- "idx_budgets_user" btree (user_id)
- "idx_budgets_category" btree (category)
- "idx_budgets_date_range" btree (start_date, end_date)

外键约束：
- "budgets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 14. consumption_decisions (消费决策表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('consumption_decisions_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| decision_type | varchar(50) | 否 | | 决策类型 |
| amount | numeric(15,2) | 否 | | 决策金额 |
| category | varchar(50) | 否 | | 消费类别 |
| decision_factors | jsonb | 是 | | 决策因素 |
| decision_result | varchar(20) | 否 | | 决策结果 |
| execution_status | varchar(20) | 否 | 'pending' | 执行状态 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

分区说明：
- 按月分区
- 子表: consumption_decisions_y2024m01

索引：
- "consumption_decisions_pkey" PRIMARY KEY, btree (id)
- "idx_consumption_decisions_user" btree (user_id)
- "idx_consumption_decisions_type" btree (decision_type)
- "idx_consumption_decisions_result" btree (decision_result)

外键约束：
- "consumption_decisions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 15. consumption_decisions_y2024m01 (消费决策分区表)
继承自 consumption_decisions 表
分区范围：FROM ('2024-01-01') TO ('2024-02-01')

### 16. equivalence_conversions (等价转换表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('equivalence_conversions_id_seq'::regclass) | 主键 |
| source_type | varchar(50) | 否 | | 源类型 |
| target_type | varchar(50) | 否 | | 目标类型 |
| conversion_rate | numeric(15,6) | 否 | | 转换率 |
| conversion_formula | text | 是 | | 转换公式 |
| is_bidirectional | boolean | 否 | false | 是否双向 |
| metadata | jsonb | 是 | | 元数据 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "equivalence_conversions_pkey" PRIMARY KEY, btree (id)
- "idx_equivalence_conversions_types" btree (source_type, target_type)

### 17. expert_analysis (专家分析表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('expert_analysis_id_seq'::regclass) | 主键 |
| expert_model_id | integer | 否 | | 专家模型ID |
| analysis_type | varchar(50) | 否 | | 分析类型 |
| input_data | jsonb | 否 | | 输入数据 |
| analysis_result | jsonb | 否 | | 分析结果 |
| confidence_score | numeric(5,2) | 是 | | 置信度 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "expert_analysis_pkey" PRIMARY KEY, btree (id)
- "idx_expert_analysis_model" btree (expert_model_id)
- "idx_expert_analysis_type" btree (analysis_type)

外键约束：
- "expert_analysis_expert_model_id_fkey" FOREIGN KEY (expert_model_id) REFERENCES expert_models(id)

### 18. expert_models (专家模型表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('expert_models_id_seq'::regclass) | 主键 |
| model_name | varchar(100) | 否 | | 模型名称 |
| model_type | varchar(50) | 否 | | 模型类型 |
| model_version | varchar(50) | 否 | | 模型版本 |
| parameters | jsonb | 是 | | 模型参数 |
| is_active | boolean | 否 | true | 是否激活 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "expert_models_pkey" PRIMARY KEY, btree (id)
- "idx_expert_models_type" btree (model_type)

### 19. financial_goals (财务目标表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('financial_goals_id_seq'::regclass) | 主键 |
| goal_name | varchar(100) | 否 | | 目标名称 |
| description | text | 是 | | 目标描述 |
| goal_type | varchar(50) | 否 | | 目标类型 |
| target_amount | numeric(15,2) | 否 | | 目标金额 |
| priority | integer | 否 | 0 | 优先级 |
| status | varchar(20) | 否 | 'active' | 目标状态 |
| start_date | date | 否 | | 开始日期 |
| target_date | date | 否 | | 目标日期 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "financial_goals_pkey" PRIMARY KEY, btree (id)
- "idx_financial_goals_type" btree (goal_type)
- "idx_financial_goals_status" btree (status)

### 20. goal_adjustment_history (目标调整历史表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('goal_adjustment_history_id_seq'::regclass) | 主键 |
| goal_id | integer | 否 | | 目标ID |
| adjustment_type | varchar(50) | 否 | | 调整类型 |
| old_value | jsonb | 否 | | 原值 |
| new_value | jsonb | 否 | | 新值 |
| reason | text | 是 | | 调整原因 |
| adjusted_by | integer | 否 | | 调整人ID |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |

索引：
- "goal_adjustment_history_pkey" PRIMARY KEY, btree (id)
- "idx_goal_adjustment_history_goal" btree (goal_id)
- "idx_goal_adjustment_history_type" btree (adjustment_type)

外键约束：
- "goal_adjustment_history_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES financial_goals(id)
- "goal_adjustment_history_adjusted_by_fkey" FOREIGN KEY (adjusted_by) REFERENCES users(id)

### 21. investment_returns (投资回报表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('investment_returns_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| portfolio_id | integer | 否 | | 投资组合ID |
| return_type | varchar(50) | 否 | | 回报类型 |
| amount | numeric(15,2) | 否 | | 回报金额 |
| return_rate | numeric(8,4) | 是 | | 回报率 |
| return_date | date | 否 | | 回报日期 |
| description | text | 是 | | 描述 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "investment_returns_pkey" PRIMARY KEY, btree (id)
- "idx_investment_returns_user" btree (user_id)
- "idx_investment_returns_portfolio" btree (portfolio_id)
- "idx_investment_returns_date" btree (return_date)

外键约束：
- "investment_returns_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
- "investment_returns_portfolio_id_fkey" FOREIGN KEY (portfolio_id) REFERENCES portfolios(id)

### 22. life_stages (生命阶段表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('life_stages_id_seq'::regclass) | 主键 |
| stage_name | varchar(100) | 否 | | 阶段名称 |
| description | text | 是 | | 阶段描述 |
| age_range | int4range | 否 | | 年龄范围 |
| characteristics | jsonb | 是 | | 阶段特征 |
| financial_focus | text[] | 是 | | 财务重点 |
| risk_tolerance | integer | 是 | | 风险承受度 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "life_stages_pkey" PRIMARY KEY, btree (id)
- "idx_life_stages_age_range" gist (age_range)

### 23. notification_history (通知历史表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('notification_history_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| notification_type | varchar(50) | 否 | | 通知类型 |
| title | varchar(255) | 否 | | 通知标题 |
| content | text | 否 | | 通知内容 |
| status | varchar(20) | 否 | 'unread' | 通知状态 |
| read_at | timestamp with time zone | 是 | | 阅读时间 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "notification_history_pkey" PRIMARY KEY, btree (id)
- "idx_notification_history_user" btree (user_id)
- "idx_notification_history_type" btree (notification_type)
- "idx_notification_history_status" btree (status)

外键约束：
- "notification_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 24. notification_settings (通知设置表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('notification_settings_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| notification_type | varchar(50) | 否 | | 通知类型 |
| channel | varchar(50) | 否 | | 通知渠道 |
| is_enabled | boolean | 否 | true | 是否启用 |
| frequency | varchar(20) | 是 | | 通知频率 |
| quiet_hours | int4range | 是 | | 免打扰时间 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "notification_settings_pkey" PRIMARY KEY, btree (id)
- "idx_notification_settings_user" btree (user_id)
- "idx_notification_settings_type" btree (notification_type)

外键约束：
- "notification_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 25. payment_methods (支付方式表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('payment_methods_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| method_name | varchar(100) | 否 | | 支付方式名称 |
| method_type | varchar(50) | 否 | | 支付方式类型 |
| provider | varchar(100) | 是 | | 提供商 |
| account_number | varchar(100) | 是 | | 账号 |
| expiry_date | date | 是 | | 过期日期 |
| is_default | boolean | 否 | false | 是否默认 |
| status | varchar(20) | 否 | 'active' | 状态 |
| metadata | jsonb | 是 | | 元数据 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "payment_methods_pkey" PRIMARY KEY, btree (id)
- "idx_payment_methods_user" btree (user_id)
- "idx_payment_methods_type" btree (method_type)

外键约束：
- "payment_methods_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 26. persona_templates (人设模板表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('persona_templates_id_seq'::regclass) | 主键 |
| template_name | varchar(100) | 否 | | 模板名称 |
| description | text | 是 | | 描述 |
| characteristics | jsonb | 否 | | 特征 |
| financial_preferences | jsonb | 是 | | 财务偏好 |
| risk_profile | jsonb | 是 | | 风险画像 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "persona_templates_pkey" PRIMARY KEY, btree (id)
- "idx_persona_templates_name" btree (template_name)

### 27. portfolios (投资组合表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('portfolios_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| portfolio_name | varchar(100) | 否 | | 组合名称 |
| portfolio_type | varchar(50) | 否 | | 组合类型 |
| risk_level | integer | 否 | | 风险等级 |
| target_allocation | jsonb | 是 | | 目标配置 |
| current_allocation | jsonb | 是 | | 当前配置 |
| total_value | numeric(15,2) | 否 | 0.00 | 总价值 |
| status | varchar(20) | 否 | 'active' | 状态 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "portfolios_pkey" PRIMARY KEY, btree (id)
- "idx_portfolios_user" btree (user_id)
- "idx_portfolios_type" btree (portfolio_type)

外键约束：
- "portfolios_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 28. transactions (交易记录表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('transactions_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| transaction_type | varchar(50) | 否 | | 交易类型 |
| amount | numeric(15,2) | 否 | | 交易金额 |
| currency | varchar(10) | 否 | 'CNY' | 货币类型 |
| transaction_date | timestamp with time zone | 否 | | 交易日期 |
| category | varchar(50) | 否 | | 交易类别 |
| description | text | 是 | | 交易描述 |
| payment_method_id | integer | 是 | | 支付方式ID |
| status | varchar(20) | 否 | 'completed' | 交易状态 |
| metadata | jsonb | 是 | | 元数据 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "transactions_pkey" PRIMARY KEY, btree (id)
- "idx_transactions_user" btree (user_id)
- "idx_transactions_date" btree (transaction_date)
- "idx_transactions_category" btree (category)
- "idx_transactions_payment_method" btree (payment_method_id)

外键约束：
- "transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
- "transactions_payment_method_id_fkey" FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)

### 29. user_achievements (用户成就表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('user_achievements_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| achievement_id | integer | 否 | | 成就ID |
| achieved_at | timestamp with time zone | 否 | | 达成时间 |
| progress | numeric(5,2) | 是 | | 完成进度 |
| metadata | jsonb | 是 | | 元数据 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "user_achievements_pkey" PRIMARY KEY, btree (id)
- "idx_user_achievements_user" btree (user_id)
- "idx_user_achievements_achievement" btree (achievement_id)

外键约束：
- "user_achievements_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
- "user_achievements_achievement_id_fkey" FOREIGN KEY (achievement_id) REFERENCES achievements(id)

### 30. user_alerts (用户预警表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('user_alerts_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| alert_type | varchar(50) | 否 | | 预警类型 |
| threshold | numeric(15,2) | 否 | | 阈值 |
| comparison_operator | varchar(10) | 否 | | 比较运算符 |
| is_active | boolean | 否 | true | 是否激活 |
| notification_method | varchar(50) | 否 | | 通知方式 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "user_alerts_pkey" PRIMARY KEY, btree (id)
- "idx_user_alerts_user" btree (user_id)
- "idx_user_alerts_type" btree (alert_type)

外键约束：
- "user_alerts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 31. user_goals (用户目标表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('user_goals_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| goal_id | integer | 否 | | 目标ID |
| target_amount | numeric(15,2) | 否 | | 目标金额 |
| current_amount | numeric(15,2) | 否 | 0.00 | 当前金额 |
| start_date | date | 否 | | 开始日期 |
| target_date | date | 否 | | 目标日期 |
| status | varchar(20) | 否 | 'in_progress' | 状态 |
| priority | integer | 否 | 0 | 优先级 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "user_goals_pkey" PRIMARY KEY, btree (id)
- "idx_user_goals_user" btree (user_id)
- "idx_user_goals_goal" btree (goal_id)
- "idx_user_goals_status" btree (status)

外键约束：
- "user_goals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
- "user_goals_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES financial_goals(id)

### 32. user_personas (用户人设表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('user_personas_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| template_id | integer | 是 | | 模板ID |
| persona_data | jsonb | 否 | | 人设数据 |
| is_active | boolean | 否 | true | 是否激活 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "user_personas_pkey" PRIMARY KEY, btree (id)
- "idx_user_personas_user" btree (user_id)
- "idx_user_personas_template" btree (template_id)

外键约束：
- "user_personas_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
- "user_personas_template_id_fkey" FOREIGN KEY (template_id) REFERENCES persona_templates(id)

### 33. user_preferences (用户偏好表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('user_preferences_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| preference_type | varchar(50) | 否 | | 偏好类型 |
| preference_value | jsonb | 否 | | 偏好值 |
| is_active | boolean | 否 | true | 是否激活 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "user_preferences_pkey" PRIMARY KEY, btree (id)
- "idx_user_preferences_user" btree (user_id)
- "idx_user_preferences_type" btree (preference_type)

外键约束：
- "user_preferences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 34. user_profiles (用户档案表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('user_profiles_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| full_name | varchar(100) | 是 | | 全名 |
| birth_date | date | 是 | | 出生日期 |
| gender | varchar(20) | 是 | | 性别 |
| occupation | varchar(100) | 是 | | 职业 |
| income_range | int4range | 是 | | 收入范围 |
| education_level | varchar(50) | 是 | | 教育水平 |
| marital_status | varchar(20) | 是 | | 婚姻状况 |
| address | jsonb | 是 | | 地址信息 |
| contact_info | jsonb | 是 | | 联系信息 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "user_profiles_pkey" PRIMARY KEY, btree (id)
- "idx_user_profiles_user" btree (user_id)
- "idx_user_profiles_income" gist (income_range)

外键约束：
- "user_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 35. user_settings (用户设置表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('user_settings_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| setting_type | varchar(50) | 否 | | 设置类型 |
| setting_value | jsonb | 否 | | 设置值 |
| is_active | boolean | 否 | true | 是否激活 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "user_settings_pkey" PRIMARY KEY, btree (id)
- "idx_user_settings_user" btree (user_id)
- "idx_user_settings_type" btree (setting_type)

外键约束：
- "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 36. users (用户表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('users_id_seq'::regclass) | 主键 |
| username | varchar(50) | 否 | | 用户名 |
| email | varchar(255) | 否 | | 电子邮箱 |
| password_hash | varchar(255) | 否 | | 密码哈希 |
| status | varchar(20) | 否 | 'active' | 用户状态 |
| last_login | timestamp with time zone | 是 | | 最后登录时间 |
| is_verified | boolean | 否 | false | 是否验证 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "users_pkey" PRIMARY KEY, btree (id)
- "users_email_key" UNIQUE, btree (email)
- "users_username_key" UNIQUE, btree (username)
- "idx_users_status" btree (status)

### 37. wealth_components (财富组成表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('wealth_components_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| component_type | varchar(50) | 否 | | 组成类型 |
| component_name | varchar(100) | 否 | | 组成名称 |
| current_value | numeric(15,2) | 否 | | 当前价值 |
| currency | varchar(10) | 否 | 'CNY' | 货币类型 |
| risk_level | integer | 是 | | 风险等级 |
| liquidity_level | integer | 是 | | 流动性等级 |
| metadata | jsonb | 是 | | 元数据 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "wealth_components_pkey" PRIMARY KEY, btree (id)
- "idx_wealth_components_user" btree (user_id)
- "idx_wealth_components_type" btree (component_type)

外键约束：
- "wealth_components_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

### 38. wealth_snapshots (财富快照表)
| 列名 | 类型 | 可空 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | bigint | 否 | nextval('wealth_snapshots_id_seq'::regclass) | 主键 |
| user_id | integer | 否 | | 用户ID |
| snapshot_date | date | 否 | | 快照日期 |
| total_assets | numeric(15,2) | 否 | | 总资产 |
| total_liabilities | numeric(15,2) | 否 | | 总负债 |
| net_worth | numeric(15,2) | 否 | | 净资产 |
| component_details | jsonb | 是 | | 组成详情 |
| created_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | timestamp with time zone | 是 | CURRENT_TIMESTAMP | 更新时间 |

索引：
- "wealth_snapshots_pkey" PRIMARY KEY, btree (id)
- "idx_wealth_snapshots_user" btree (user_id)
- "idx_wealth_snapshots_date" btree (snapshot_date)

外键约束：
- "wealth_snapshots_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)


