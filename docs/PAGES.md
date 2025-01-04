# AI预见式财富管理工具 - 页面功能详解

## 目录
1. [首页](#首页) (`/`)
2. [AI助手](#ai助手) (`/chat`) 
3. [预算管理](#预算管理) (`/budget`)
4. [投资组合](#投资组合) (`/portfolio`)
5. [理财目标](#理财目标) (`/goals`)
6. [消费记录](#消费记录) (`/expenses`)
7. [储蓄计划](#储蓄计划) (`/savings`)
8. [理财产品](#理财产品) (`/products`)
9. [风险评估](#风险评估) (`/risk`)
10. [市场资讯](#市场资讯) (`/news`)
11. [账户设置](#账户设置) (`/settings`)
12. [通知中心](#通知中心) (`/notifications`)
13. [个人资料](#个人资料) (`/profile`)
14. [个人资料详情](#个人资料详情) (`/profile/personal-info`)
15. [通知设置](#通知设置) (`/profile/notifications`)
16. [勋章馆](#勋章馆) (`/profile/badges`)
17. [新用户引导](#新用户引导) (`/onboarding`)
    - [基本信息](#基本信息) (`/onboarding`)
    - [人生阶段](#人生阶段) (`/onboarding/step2`)
    - [生活水平](#生活水平) (`/onboarding/step3`)
    - [人生目标](#人生目标) (`/onboarding/step4`)
18. [用户认证](#用户认证)
    - [登录](#登录页面) (`/login`)
    - [注册](#注册页面) (`/register`)


## 1. 首页 (/)

### 页面布局
- 顶部导航栏
  - 快捷菜单按钮
  - 页面标题："财务概览"
  - 用户头像下拉菜单
    - 个人资料
    - 登录/退出选项

### 核心数据展示

#### 1.1 可支配收入分析
每个指标包含：
```typescript
{
  title: string;           // 指标标题
  amount: number;          // 当前金额
  trend: number;          // 环比变化率
  subtitle: string;       // 变化描述
}
```

示例数据：
```typescript
{
  title: "当月可支配金额",
  amount: 3680,
  trend: 25,
  subtitle: "较上月增长25%"
}
```

#### 1.2 预算类别监控
数据结构：
```typescript
{
  title: string;        // 类别名称
  percentage: number;   // 完成百分比
  amount: number;       // 当前金额
  total: number;       // 总预算
  color: string;       // 显示颜色
  thresholds: {        // 预警阈值
    color: string;     // 阈值颜色
    amount: number;    // 阈值金额
    label: string;     // 阈值标签
  }[];
  subcategories: {     // 子类别
    name: string;      // 子类别名称
    amount: number;    // 子类别金额
  }[];
}
```

示例数据：
```typescript
{
  title: "固定生活成本",
  percentage: 75,
  amount: 3750,
  total: 5000,
  color: "text-blue-600",
  thresholds: [
    { color: "text-red-500", amount: 4500, label: "红线" },
    { color: "text-yellow-500", amount: 4000, label: "黄线" },
    { color: "text-green-500", amount: 3500, label: "绿线" }
  ],
  subcategories: [
    { name: "房租", amount: 2000 },
    { name: "水电", amount: 500 },
    { name: "通勤", amount: 500 },
    { name: "餐食", amount: 750 }
  ]
}
```

#### 1.3 月度收支趋势
数据结构：
```typescript
{
  date: string;        // 月份
  value: number;       // 金额
}[]
```

示例数据：
```typescript
[
  { date: "1月", value: 2400 },
  { date: "2月", value: 1398 },
  { date: "3月", value: 9800 },
  { date: "4月", value: 3908 },
  { date: "5月", value: 4800 },
  { date: "6月", value: 3800 },
  { date: "7月", value: 4300 }
]
```

#### 1.4 重要里程碑
数据结构：
```typescript
{
  icon: string;        // 图标类型
  iconBg: string;      // 图标背景色
  iconColor: string;   // 图标颜色
  title: string;       // 里程碑标题
  message: string;     // 里程碑描述
}
```

示例数据：
```typescript
{
  icon: "Trophy",
  iconBg: "bg-yellow-100",
  iconColor: "text-yellow-600",
  title: "达成11月储蓄目标",
  message: "恭喜您完成了本月3000元的储蓄目标！"
}
```

### 交互特性
1. 可支配收入卡片
   - 点击展开详细分析面板
2. 预算类别圆环
   - 点击展开子类别详情
   - 显示预警阈值线
3. 里程碑点击
   - 触发奖杯动画
   - 显示成就详情
4. 响应式布局
   - 适配移动端和桌面端
5. 动画效果
   - 内容渐入动画
   - 卡片展开/收起动画
   - 背景模糊效果

### 功能入口
1. 反向财富管理功能
2. 收支历史详情
3. 里程碑完整列表
4. 快捷仪表盘
5. 个人资料设置

[其他页面内容...]
## 2. 快速概览 (/quick-dashboard)

### 页面布局
- 侧边滑出式面板
- 顶部标题栏
  - 标题："快速概览"
  - 关闭按钮

### 核心数据展示

#### 2.1 财务状况卡片
每个卡片包含：
```typescript
{
  icon: React.ElementType;  // 图标组件
  title: string;           // 卡片标题
  status: {
    emoji: string;         // 状态表情
    text: string;          // 状态描述
    advice: string;        // 建议内容
    amount: string;        // 具体金额
    change: string;        // 变化百分比
  }
}
```

主要监控指标：
1. 本月支出
   ```typescript
   {
     emoji: "😠",
     text: "恨铁不成钢",
     advice: "支出过高，考虑削减非必要开支",
     amount: "5,280",
     change: "+15%"
   }
   ```

2. 总储蓄
   ```typescript
   {
     emoji: "😊",
     text: "储蓄不错",
     advice: "别忘了投资对冲通货膨胀",
     amount: "50,000",
     change: "+8%"
   }
   ```

3. 投资收益
   ```typescript
   {
     emoji: "🤔",
     text: "有待提高",
     advice: "考虑多元化投资组合",
     amount: "2,800",
     change: "+3%"
   }
   ```

4. 可支配收入
   ```typescript
   {
     emoji: "😌",
     text: "状况良好",
     advice: "合理分配到储蓄和投资",
     amount: "3,500",
     change: "+5%"
   }
   ```

### 快速链接
- 预算设置 (/budget-settings)
- 财富构成 (/wealth-composition)
- 反向财富管理 (/wealth-management)
- 财务目标 (/financial-goals)

### 交互特性
1. 卡片展开/收起
   - 点击卡片显示详细信息
   - 再次点击收起
2. 动画效果
   - 侧边栏滑入/滑出动画
   - 背景模糊效果
3. 响应式布局
   - 移动端：w-[180px]
   - 平板：w-80
   - 桌面端：w-[384px]

## 3. 预算设置 (/budget-settings)

### 页面布局
- 助手布局组件
  - 顶部导航栏
    - 返回按钮
    - 页面标题："预算设置"
    - 页面描述："设置和管理您的月度预算"
  - 内容区域
  - 底部保存按钮

### 核心数据展示

#### 3.1 总预算设置
数据结构：
```typescript
{
  totalBudget: number;    // 月度总预算金额
}
```

示例数据：
```typescript
{
  totalBudget: 5000
}
```

#### 3.2 预算分类
数据结构：
```typescript
{
  name: string;           // 类别名称
  percentage: number;     // 占比百分比
  color: string;         // 显示颜色
}[]
```

示例数据：
```typescript
[
  { name: '生活必需品', percentage: 50, color: 'rgb(255, 99, 132)' },
  { name: '娱乐', percentage: 20, color: 'rgb(54, 162, 235)' },
  { name: '储蓄', percentage: 20, color: 'rgb(255, 206, 86)' },
  { name: '其他', percentage: 10, color: 'rgb(75, 192, 192)' }
]
```

#### 3.3 AI评估数据
数据结构：
```typescript
{
  ai_evaluation_details: {
    budget_settings: {
      total_budget: number;
      categories: {
        name: string;
        percentage: number;
        color: string;
      }[];
    }
  }
}
```

### 交互特性
1. 总预算调整
   - 直接输入数字修改
   - 实时计算各类别具体金额

2. 预算分配
   - 拖动滑块调整百分比
   - 自动平衡其他类别占比
   - 圆形进度指示器实时更新
   - 添加/删除预算类别

3. 动画效果
   - 页面内容渐入动画
   - 类别列表项滑入动画
   - 保存按钮渐入效果

4. 响应式布局
   - 移动端：两列布局
   - 桌面端：四列布局

### API 接口
1. 获取预算设置
```typescript
GET /api/v1/user/profile
Response: {
  ai_evaluation_details: {
    budget_settings: {
      total_budget: number;
      categories: Array<{
        name: string;
        percentage: number;
        color: string;
      }>;
    }
  }
}
```

2. 保存预算设置
```typescript
POST /api/v1/user/calibrate/budget
Body: {
  total_budget: number;
  categories: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
}
```

### 功能入口
1. 返回首页
2. 保存预算设置

## 4. 财富构成 (/wealth-composition)

### 页面布局
- 助手布局组件
  - 顶部导航栏
    - 返回按钮
    - 页面标题："财富构成"
    - 页面描述："查看和管理您的财富组成"
  - 内容区域

### 核心数据展示

#### 4.1 财富组成项
数据结构：
```typescript
interface WealthComponent {
  id: string;           // 组件唯一标识
  name: string;         // 资产名称
  value: number;        // 资产价值
  icon: string;         // 图标类型
}
```

示例数据：
```typescript
[
  { id: '1', name: '收入', value: 150000, icon: 'Briefcase' },
  { id: '2', name: '固定资产', value: 1000000, icon: 'Building' },
  { id: '3', name: '金融资产', value: 500000, icon: 'CreditCard' },
  { id: '4', name: '储蓄', value: 250000, icon: 'PiggyBank' }
]
```

#### 4.2 AI评估数据
数据结构：
```typescript
{
  ai_evaluation_details: {
    wealth_composition: Array<{
      id: string;
      name: string;
      value: number;
      icon: string;
    }>;
  }
}
```

### 交互特性
1. 总资产展示
   - 动态计算总资产值
   - 数值放大动画效果

2. 饼图可视化
   - 交互式饼图展示
   - 悬停显示详细信息
   - 自动计算百分比
   - 图例说明

3. 资产项管理
   - 添加新资产项
   - 编辑资产值
   - 删除资产项
   - 实时更新总资产

4. 动画效果
   - 页面内容渐入动画
   - 列表项滑入动画
   - 编辑状态切换动画

5. 响应式布局
   - 移动端：垂直布局
   - 桌面端：水平布局

### API 接口
1. 获取财富构成数据
```typescript
GET /api/v1/user/profile
Response: {
  ai_evaluation_details: {
    wealth_composition: Array<{
      id: string;
      name: string;
      value: number;
      icon: string;
    }>;
  }
}
```

### 功能入口
1. 返回首页
2. 添加资产项
3. 编辑现有资产
4. 查看详细分析

## 5. 反向财富管理 (/wealth-management)

### 页面布局
- 助手布局组件
  - 顶部导航栏
    - 返回按钮
    - 页面标题："反向财富管理"
    - 页面描述："通过分类管理不同账户来掌控您的财富"
  - 内容区域

### 核心数据展示

#### 5.1 账户数据
数据结构：
```typescript
type Account = {
  id: string;           // 账户唯一标识
  name: string;         // 账户名称
  balance: number;      // 账户余额
  purpose: string;      // 账户用途
  description: string;  // 用途描述
}
```

示例数据：
```typescript
[
  { 
    id: '1', 
    name: '微信', 
    balance: 2000, 
    purpose: '冲动消费', 
    description: '请客、奶茶、衣服、鞋子' 
  },
  { 
    id: '2', 
    name: '工资卡', 
    balance: 10000, 
    purpose: '固定支出', 
    description: '房租、水电、通勤、餐食' 
  },
  { 
    id: '3', 
    name: '储蓄卡', 
    balance: 50000, 
    purpose: '储蓄投资', 
    description: '长期储蓄、投资理财' 
  }
]
```

#### 5.2 账户用途类型
```typescript
const PURPOSE_DESCRIPTIONS = {
  '固定支出': '房租、水电、通勤、餐食',
  '冲动消费': '请客、奶茶、衣服、鞋子',
  '意外消费': '医疗、随礼、应急',
  '储蓄投资': '长期储蓄、投资理财',
  '日常消费': '日常开销、零食、娱乐'
}
```

#### 5.3 AI评估数据
数据结构：
```typescript
{
  ai_evaluation_details: {
    wealth_management: Array<Account>
  }
}
```

### 交互特性
1. 总余额展示
   - 动态计算总余额
   - 数值放大动画效果
   - 环形图可视化展示

2. 账户管理
   - 添加新账户
   - 编辑现有账户
   - 删除账户
   - 实时更新总余额

3. 智能分析
   - 自动分析财富状况
   - 提供个性化建议
   - 储蓄比例监控

4. 动画效果
   - 页面内容渐入动画
   - 账户列表项滑入动画
   - 编辑状态切换动画

5. 响应式布局
   - 自适应卡片布局
   - 移动端优化显示

### API 接口
1. 获取账户数据
```typescript
GET /api/v1/user/profile
Response: {
  ai_evaluation_details: {
    wealth_management: Array<Account>
  }
}
```

### 功能入口
1. 返回首页
2. 添加新账户
3. 保存财富状况
4. 生成详细报告

## 6. 财务目标 (/financial-goals)

### 页面布局
- 助手布局组件
  - 顶部导航栏
    - 返回按钮
    - 页面标题："财务目标"
    - 页面描述："设置和跟踪您的财务目标"
  - 内容区域

### 核心数据展示

#### 6.1 目标数据
数据结构：
```typescript
type Goal = {
  id: string;           // 目标唯一标识
  name: string;         // 目标名称
  targetAmount: number; // 目标金额
  currentAmount: number;// 当前完成金额
  deadline: Date;       // 目标截止日期
}
```

示例数据：
```typescript
[
  { 
    id: '1', 
    name: '购买新车', 
    targetAmount: 200000, 
    currentAmount: 50000, 
    deadline: new Date(2024, 11, 31) 
  },
  { 
    id: '2', 
    name: '环球旅行', 
    targetAmount: 100000, 
    currentAmount: 30000, 
    deadline: new Date(2025, 5, 30) 
  },
  { 
    id: '3', 
    name: '创业资金', 
    targetAmount: 500000, 
    currentAmount: 100000, 
    deadline: new Date(2026, 0, 1) 
  }
]
```

#### 6.2 新目标表单数据
数据结构：
```typescript
{
  name: string;         // 目标名称
  targetAmount: number; // 目标金额
  deadline: string;     // 目标日期
}
```

### 交互特性
1. 目标管理
   - 添加新目标
   - 编辑现有目标
   - 删除目标
   - 进度条可视化

2. 目标编辑
   - 修改目标名称
   - 调整目标金额
   - 更新当前进度
   - 设置截止日期

3. 进度展示
   - 进度条显示完成比例
   - 显示具体金额和百分比
   - 显示截止日期

4. 动画效果
   - 页面内容渐入动画
   - 目标列表项滑入动画
   - 编辑状态切换动画
   - 添加/删除动画

5. 响应式布局
   - 自适应卡片布局
   - 移动端优化显示

### 通知功能
1. 目标添加通知
```typescript
{
  title: "目标已添加",
  description: `${goalName} 已成功添加到您的财务目标列表。`
}
```

2. 目标更新通知
```typescript
{
  title: "目标已更新",
  description: `${goalName} 的信息已成功更新。`
}
```

3. 目标删除通知
```typescript
{
  title: "目标已删除",
  description: `${goalName} 已从您的财务目标列表中删除。`
}
```

### 功能入口
1. 返回首页
2. 查看已完成的目标
3. 设置提醒
4. 添加新目标

## 7. AI 决策评估 (/decisions)

### 页面布局
- 顶部标题区
  - 页面标题："财富困惑，智能道破"
  - 背景增强效果
- 内容区域
  - 金额输入
  - 支付方式选择
  - AI 评估按钮
  - 历史记录列表

### 核心数据展示

#### 7.1 支付方式
数据结构：
```typescript
type PaymentMethod = 'one-time' | 'installment' | null

type InstallmentOption = {
  value: number;
  unit: 'month' | 'year';
}
```

#### 7.2 决策类型
数据结构：
```typescript
type DecisionType = 'approved' | 'caution' | 'warning'

interface AIEvaluationHistory {
  id: string;
  label: string;
  time: string;
  amount: string;
  decision: DecisionType;
}
```

示例数据：
```typescript
[
  {
    id: '1',
    label: '购买电子产品',
    time: '2024-03-15 14:30',
    amount: '5,999',
    decision: 'approved'
  },
  {
    id: '2',
    label: '房屋装修',
    time: '2024-03-14 09:15',
    amount: '50,000',
    decision: 'caution'
  }
]
```

### 交互特性
1. 金额输入
   - 数字键盘输入
   - 金额格式化显示
   - 清除功能
   - 确认功能

2. 支付方式选择
   - 一次性支付
   - 分期支付选项
   - 分期期数选择
   - 选择提醒动画

3. AI 评估流程
   - 输入验证
   - 加载动画
   - 结果跳转
   - 错误提示

4. 动画效果
   - 金额输入卡片悬浮效果
   - 支付方式选择动画
   - 提醒震动效果
   - 加载动画

5. 响应式布局
   - 移动端优化
   - 数字键盘适配
   - 分期选项自适应

### 决策结果展示
1. 通过 (approved)
   - 图标：绿色对勾
   - 文本："通过"

2. 谨慎 (caution)
   - 图标：黄色警告
   - 文本："谨慎"

3. 警告 (warning)
   - 图标：红色叉号
   - 文本："警告"

### 功能入口
1. 返回首页
2. 数字键盘
3. 标签选择
4. AI 评估
5. 历史记录查看

### 通知功能
```typescript
{
  title: string;
  description: string;
  duration: number;
}
```

示例：
```typescript
{
  title: "请输入金额",
  description: "在开始 AI 评估之前，请先输入一个金额。",
  duration: 3000
}
```

## 8. AI 评估详情 (/ai-evaluation/[id])

### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："AI评估详情"
- 内容区域
  - 评估状态卡片
  - 费用可视化
  - 私董会决议
  - 评估内容

### 核心数据展示

#### 8.1 评估数据
数据结构：
```typescript
interface EvaluationData {
  id: string;           // 评估ID
  purpose: string;      // 消费目的
  amount: number;       // 消费金额
  status: 'approved' | 'caution' | 'warning' | 'rejected';  // 评估状态
  score: number;        // 评估得分
  pros: string[];       // 优点列表
  cons: string[];       // 缺点列表
  evaluationPoints: {   // 评估要点
    point: string;
    description: string;
  }[];
  longTermImpact: string;    // 长期影响
  boardDecision: string;     // 私董会决议
  expertModels: {           // 专家模型评估
    name: string;
    avatar: string;
    status: string;
    emoji: string;
  }[];
}
```

示例数据：
```typescript
{
  id: "1",
  purpose: '意外医疗',
  amount: 500,
  status: 'approved',
  score: 90,
  pros: [
    "及时处理健康问题很重要",
    "金额相对较小，不会对财务造成重大影响",
    "可能防止未来更高的医疗费用"
  ],
  cons: [
    "可能影响当月其他预算",
    "如果频繁发生，需要考虑购买更好的医疗保险"
  ],
  evaluationPoints: [
    { point: "必要性高", description: "及时的医疗处理对健康至关重要" },
    { point: "紧急性", description: "医疗支出通常具有紧急性，不能轻易推迟" }
  ],
  longTermImpact: "及时的医疗处理有利于长期健康",
  boardDecision: "经过私董会讨论，认为该支出合理且必要",
  expertModels: [
    { name: "吴军", avatar: "/experts/wujun.jpg", status: 'approved', emoji: '🙋‍♂️' }
  ]
}
```

#### 8.2 费用可视化数据
数据结构：
```typescript
interface CostVisualization {
  icon: React.ElementType;
  label: string;
  emoji: string;
  color: string;
  reference: number;
  quantity: number;
}
```

### 交互特性
1. 状态展示
   - 状态徽章动画
   - 金额放大效果
   - 状态颜色区分

2. 费用可视化
   - 进度条动画
   - 参考价格对比
   - 数量比例展示

3. 专家评估
   - 头像展示
   - 状态标识
   - 表情反馈

4. 动画效果
   - 页面滑入动画
   - 卡片展开效果
   - 进度条加载动画

5. 响应式布局
   - 移动端优化
   - 卡片自适应
   - 图表响应式

### 状态颜色规范
```typescript
{
  approved: 'text-green-600',
  caution: 'text-yellow-600',
  warning: 'text-orange-600',
  rejected: 'text-red-600'
}
```

### 状态文本映射
```typescript
{
  approved: '通过',
  caution: '谨慎',
  warning: '警告',
  rejected: '不通过'
}
```

### 功能入口
1. 返回评估列表
2. 查看详细分析
3. 专家观点详情
4. 长期影响分析

## 9. 人情往来助手 (/social-reciprocity)

### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："人情往来助手"
- 助手介绍区
  - 头像展示
  - 功能简介
- 内容区域
  - 信息输入表单
  - 聊天消息列表
- 底部输入栏

### 核心数据展示

#### 9.1 聊天消息
数据结构：
```typescript
interface ChatMessage {
  id: string;           // 消息ID
  content: string;      // 消息内容
  isUser: boolean;      // 是否用户消息
  timestamp: Date;      // 时间戳
}
```

#### 9.2 场景选项
数据结构：
```typescript
interface ScenarioItem {
  title: string;        // 场景标题
  value: string;        // 场景值
}
```

示例数据：
```typescript
const scenarioItems = [
  { title: "人生重大时刻", value: "life_milestone" },
  { title: "探病送礼", value: "hospital_visit" },
  { title: "结婚随礼", value: "wedding_gift" },
  { title: "生日庆祝", value: "birthday" },
  { title: "升学祝贺", value: "graduation" },
  { title: "乔迁新居", value: "housewarming" }
]
```

#### 9.3 关系类型
```typescript
const commonRelationships = [
  "亲戚", "朋友", "同事", "邻居", "同学", "长辈", "晚辈"
]
```

### 交互特性
1. 地区选择
   - 省份联动
   - 城市联动
   - 禁用状态管理

2. 表单输入
   - 时间选择器
   - 金额/礼物输入
   - 关系选择
   - 场景选择
   - 历史礼金记录

3. 聊天功能
   - 消息发送
   - 消息展示
   - 加载状态
   - 自动回复

4. 动画效果
   - 消息滑入动画
   - 表单展开/收起
   - 加载动画

5. 响应式布局
   - 移动端优化
   - 键盘弹出适配
   - 滚动区域管理

### 智能分析
1. 考虑因素
   - 地域差异
   - 时间跨度
   - 通货膨胀
   - 关系远近
   - 场景特殊性
   - 历史往来

2. 建议输出
```typescript
interface AnalysisResult {
  suggestion: string;   // 建议内容
  reasoning: string;    // 推理过程
  factors: string[];    // 考虑因素
  amount: number;       // 建议金额
}
```

### 功能入口
1. 返回决策页面
2. 开始分析
3. 发送消息
4. 查看历史记录

## 11. 提前消费助手 (/advance-consumption)

### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："提前消费助手"
- 助手介绍区
  - 头像展示
  - 功能简介："我会帮您合理安排提前消费，平衡当前享受和未来财务"
- 内容区域
  - 消费信息表单
  - 聊天消息列表
- 底部输入栏

### 核心数据展示

#### 11.1 消费类型
```typescript
const consumptionTypes = [
  { title: "结婚", value: "wedding" },
  { title: "子女教育", value: "education" },
  { title: "购房", value: "house" },
  { title: "购车", value: "car" },
  { title: "旅游", value: "travel" },
  { title: "其他大额消费", value: "other" }
]
```

#### 11.2 筹资方式
```typescript
const financingMethods = [
  { title: "储蓄", value: "savings" },
  { title: "贷款", value: "loan" },
  { title: "分期付款", value: "installment" },
  { title: "投资收益", value: "investment" }
]
```

#### 11.3 消费计划数据
```typescript
interface ConsumptionPlan {
  consumptionType: string;    // 消费类型
  amount: string;            // 预计金额
  timeframe: string;         // 计划时间
  income: string;            // 月收入
  currentSavings: string;    // 当前储蓄
  financingMethod: string;   // 筹资方式
}
```

### 交互特性
1. 表单输入
   - 消费类型选择
   - 金额输入
   - 时间规划
   - 收入信息
   - 储蓄状况
   - 筹资方式

2. 智能分析
   - 收入评估
   - 还款压力测算
   - 储蓄计划建议
   - 风险提示

3. 聊天功能
   - 消息发送
   - 消息展示
   - 加载状态
   - 智能回复

4. 动画效果
   - 消息滑入动画
   - 表单展开/收起
   - 加载动画

5. 响应式布局
   - 移动端优化
   - 键盘弹出适配
   - 滚动区域管理

### 分析维度
1. 财务健康度
   - 收入稳定性
   - 储蓄比例
   - 债务负担
   - 应急储备

2. 消费合理性
   - 消费必要性
   - 时间紧迫度
   - 替代方案
   - 机会成本

3. 风险评估
   - 还款能力
   - 收入波动
   - 通货膨胀
   - 意外情况

### 建议输出
```typescript
interface ConsumptionAdvice {
  feasibility: string;         // 可行性评估
  savingsPlan: string;        // 储蓄建议
  riskWarning: string;        // 风险提示
  alternativePlans: string[]; // 替代方案
  monthlyBudget: {           // 月度预算
    savings: number;         // 建议储蓄
    expenses: number;        // 可支配支出
    debt: number;           // 债务支出
  };
}
```

### 功能入口
1. 返回决策页面
2. 开始分析
3. 发送消息
4. 查看历史记录

## 12. 财富开发助手 (/wealth-development)

### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："财富开发助手"
- 助手介绍区
  - 头像展示
  - 功能简介："我会帮您分析财富开发机会，提供专业建议，助您实现财务增长目标"
- 内容区域
  - 开发信息表单
  - 聊天消息列表
- 底部输入栏

### 核心数据展示

#### 12.1 开发类型
```typescript
const wealthDevelopmentTypes = [
  { title: "被动收入", value: "passive_income" },
  { title: "技能变现", value: "skill_monetization" },
  { title: "副业创业", value: "side_business" },
  { title: "知识付费", value: "knowledge_payment" },
  { title: "资产配置", value: "asset_allocation" }
]
```

#### 12.2 开发计划数据
```typescript
interface DevelopmentPlan {
  developmentType: string;    // 开发类型
  currentIncome: string;      // 当前收入
  targetIncome: string;       // 目标收入
  timeframe: string;          // 预计时间
  skills: string;            // 主要技能
}
```

### 交互特性
1. 表单输入
   - 开发类型选择
   - 收入信息
   - 目标设定
   - 时间规划
   - 技能描述

2. 智能分析
   - 可行性评估
   - 市场机会分析
   - 风险评估
   - 发展路径规划

3. 聊天功能
   - 消息发送
   - 消息展示
   - 加载状态
   - 智能回复

4. 动画效果
   - 消息滑入动画
   - 表单展开/收起
   - 加载动画

5. 响应式布局
   - 移动端优化
   - 键盘弹出适配
   - 滚动区域管理

### 分析维度
1. 市场分析
   - 市场需求
   - 竞争状况
   - 发展趋势
   - 准入门槛

2. 个人能力评估
   - 技能匹配度
   - 时间投入
   - 学习曲线
   - 资源储备

3. 发展规划
   - 阶段目标
   - 关键里程碑
   - 资源配置
   - 风险控制

### 建议输出
```typescript
interface DevelopmentAdvice {
  marketAnalysis: {          // 市场分析
    demand: string;          // 市场需求
    competition: string;     // 竞争状况
    trend: string;          // 发展趋势
  };
  personalGrowth: {         // 个人成长
    skillsGap: string[];    // 技能差距
    learningPath: string;   // 学习路径
    timeInvestment: string; // 时间投入
  };
  actionPlan: {             // 行动计划
    shortTerm: string[];    // 短期行动
    midTerm: string[];      // 中期目标
    longTerm: string[];     // 长期规划
  };
}
```

### 功能入口
1. 返回决策页面
2. 开始分析
3. 发送消息
4. 查看历史记录

## 13. 个人资料 (/profile)

### 页面布局
- 顶部状态栏
  - 用户头像
  - 用户名称
  - 人生阶段
  - 编辑按钮
- 内容区域
  - AI模型设置
  - 勋章展示
  - 基础信息菜单
  - 退出登录按钮
- 底部导航栏

### 核心数据展示

#### 13.1 勋章数据
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  shortDescription: string;
}
```

示例数据：
```typescript
const badges = [
  { 
    id: "1", 
    name: "初次储蓄", 
    description: "完成人生第一笔储蓄", 
    icon: "💰", 
    shortDescription: "迈出理财第一步" 
  },
  { 
    id: "2", 
    name: "投资新人", 
    description: "进行第一次投资", 
    icon: "📈", 
    shortDescription: "开启投资之旅" 
  }
  // ... 其他勋章
]
```

#### 13.2 菜单项
```typescript
const menuItems = [
  { icon: <User />, title: "个人资料", link: "/profile/personal-info" },
  { icon: <Bell />, title: "预警通知", link: "/profile/notifications" },
  { icon: <Lock />, title: "数据隐私", link: "/profile/privacy" },
  { icon: <Award />, title: "勋章馆", link: "/profile/badges" }
]
```

### 交互特性
1. 用户信息展示
   - 头像显示
   - 名称展示
   - 阶段标识
   - 编辑功能

2. 勋章展示
   - 横向滚动
   - 勋章动画
   - 悬停效果
   - 点击反馈

3. 菜单导航
   - 图标展示
   - 点击跳转
   - 悬停效果
   - 动画过渡

4. 动画效果
   - 页面加载动画
   - 卡片滑入效果
   - 按钮悬停动画
   - 退出确认

5. 响应式布局
   - 移动端优化
   - 卡片自适应
   - 滚动区域管理

### 状态管理
1. 用户信息
```typescript
interface UserProfile {
  userName: string;
  lifeStage: string;
  avatar: string;
}
```

2. AI模型设置
```typescript
interface AISettings {
  modelType: string;
  riskTolerance: number;
  investmentStyle: string;
}
```

### 功能入口
1. 编辑个人资料
2. AI模型设置
3. 勋章馆详情
4. 通知设置
5. 隐私设置
6. 退出登录

### 动画配置
```typescript
const motionVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}
```

## 14. 个人资料详情 (/profile/personal-info)

### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："个人资料"
- 内容区域
  - 用户信息卡片
  - 详细信息列表
  - 返回按钮

### 核心数据展示

#### 14.1 用户信息数据
```typescript
interface UserInfo {
  name: string;           // 用户名称
  avatar: string;         // 头像地址
  lifeStage: string;      // 人生阶段
  riskPreference: string; // 风险偏好
  age: string;           // 年龄
  occupation: string;     // 职业
  annualIncome: string;   // 年收入
  financialGoals: string; // 财务目标
}
```

#### 14.2 风险等级映射
```typescript
const riskMap = {
  'conservative': '保守型',
  'moderate': '稳健型',
  'aggressive': '进取型'
}
```

#### 14.3 年龄组映射
```typescript
const ageMap = {
  '18-25': 22,
  '26-35': 30,
  '36-45': 40,
  '46-55': 50,
  '56+': 60
}
```

### 数据处理函数
1. 收入格式化
```typescript
const formatIncome = (annualIncome?: number) => {
  if (!annualIncome) return "未知"
  if (annualIncome < 100000) return "10万以下"
  if (annualIncome < 300000) return "10-30万"
  if (annualIncome < 500000) return "30-50万"
  return "50万以上"
}
```

2. 目标格式化
```typescript
const formatGoals = (goals: (string | undefined)[]) => {
  const validGoals = goals.filter(goal => goal)
  return validGoals.length > 0 ? validGoals.join('、') : "未设置"
}
```

### 交互特性
1. 用户信息展示
   - 头像显示
   - 基本信息
   - 编辑功能
   - 风险偏好

2. 信息列表
   - 年龄显示
   - 职业信息
   - 收入范围
   - 财务目标

3. 数据加载
   - 加载状态
   - 错误处理
   - 默认值显示
   - 数据更新

4. 动画效果
   - 页面加载动画
   - 卡片滑入效果
   - 编辑按钮动画
   - 返回按钮过渡

5. 响应式布局
   - 移动端优化
   - 卡片自适应
   - 头像缩放
   - 文字自适应

### API 接口
```typescript
interface APIResponse {
  name: string;
  avatar: string;
  life_stage: string;
  risk_tolerance: string;
  age_group: string;
  employment_status: string;
  estimated_monthly_income: number;
  short_term_goal: string;
  mid_term_goal: string;
  long_term_goal: string;
}
```

### 功能入口
1. 返回个人中心
2. 编辑个人资料
3. 更新头像
4. 修改财务目标

### 动画配置
```typescript
const motionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}
```

## 15. 通知设置 (/profile/notifications)

### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："预警通知"
- 内容区域
  - 通知设置卡片
  - 最近通知列表
- 背景效果

### 核心数据展示

#### 15.1 通知类型
```typescript
interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'warning' | 'info';
}
```

#### 15.2 通知设置
```typescript
interface NotificationSettings {
  budgetAlerts: boolean;      // 预算提醒
  savingsGoals: boolean;      // 储蓄目标
  investmentUpdates: boolean; // 投资更新
  securityAlerts: boolean;    // 安全警报
}
```

#### 15.3 设置项定义
```typescript
interface NotificationSetting {
  title: string;       // 设置标题
  description: string; // 设置描述
  enabled: boolean;    // 启用状态
  onToggle: () => void; // 切换函数
}
```

### 通知类型示例
```typescript
const notifications = [
  { 
    id: '1', 
    title: '预算超支警告', 
    description: '您的娱乐支出已超过预算20%', 
    date: '2023-05-28', 
    type: 'warning' 
  },
  { 
    id: '2', 
    title: '储蓄目标达成', 
    description: '恭喜！您已达成本月储蓄目标', 
    date: '2023-05-25', 
    type: 'info' 
  }
]
```

### 交互特性
1. 通知设置
   - 开关切换
   - 状态保存
   - 即时生效
   - 视觉反馈

2. 通知列表
   - 类型图标
   - 时间显示
   - 内容预览
   - 状态标识

3. 动画效果
   - 页面加载动画
   - 卡片滑入效果
   - 开关切换动画
   - 列表项过渡

4. 响应式布局
   - 移动端优化
   - 卡片自适应
   - 文字换行
   - 间距调整

### 视觉样式
1. 通知类型样式
```typescript
const notificationStyles = {
  warning: {
    icon: <AlertTriangle />,
    color: 'text-yellow-500'
  },
  info: {
    icon: <CheckCircle />,
    color: 'text-green-500'
  }
}
```

2. 背景效果
```typescript
const backgroundStyles = {
  gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100',
  blur: 'backdrop-blur-xl bg-white/80'
}
```

### 功能入口
1. 返回个人中心
2. 通知设置调整
3. 查看通知历史
4. 清除通知

### 动画配置
```typescript
const motionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}
```

### 状态管理
1. 通知设置状态
2. 通知列表状态
3. 加载状态
4. 错误状态

## 16. 勋章馆 (/profile/badges)

### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："勋章馆"
- 内容区域
  - 勋章网格展示
  - 进度显示
- 背景效果

### 核心数据展示

#### 16.1 勋章数据结构
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
  progress?: number;
}
```

#### 16.2 勋章示例数据
```typescript
const badges = [
  { 
    id: "1", 
    name: "初次储蓄", 
    description: "完成人生第一笔储蓄", 
    icon: "💰", 
    achieved: true 
  },
  { 
    id: "2", 
    name: "投资新人", 
    description: "进行第一次投资", 
    icon: "📈", 
    achieved: true 
  },
  { 
    id: "3", 
    name: "预算达人", 
    description: "连续三个月达成预算目标", 
    icon: "🎯", 
    achieved: false, 
    progress: 66 
  }
]
```

### 视觉样式
1. 勋章卡片样式
```typescript
const badgeStyles = {
  achieved: {
    card: 'bg-yellow-50',
    icon: 'bg-yellow-200'
  },
  inProgress: {
    card: 'bg-gray-50',
    icon: 'bg-gray-200'
  }
}
```

2. 进度条样式
```typescript
const progressStyles = {
  container: 'w-full bg-gray-200 rounded-full h-2.5',
  bar: 'bg-blue-600 h-2.5 rounded-full'
}
```

### 交互特性
1. 勋章展示
   - 网格布局
   - 图标显示
   - 状态区分
   - 进度展示

2. 成就状态
   - 已获得标识
   - 进度条显示
   - 颜色区分
   - 动画效果

3. 动画效果
   - 页面加载动画
   - 卡片悬浮效果
   - 进度条动画
   - 状态切换过渡

4. 响应式布局
   - 网格自适应
   - 卡片大小调整
   - 间距响应
   - 文字自适应

### 成就类型
1. 储蓄相关
   - 初次储蓄
   - 储蓄达人
   - 目标达成

2. 投资相关
   - 投资新人
   - 稳健增长
   - 收益达标

3. 预算管理
   - 预算达人
   - 节俭之星
   - 支出控制

4. AI互动
   - 理财小能手
   - 决策达人
   - 学习成长

### 功能入口
1. 返回个人中心
2. 查看勋章详情
3. 分享成就
4. 任务指引

### 动画配置
```typescript
const motionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}
```

### 状态管理
1. 勋章列表状态
2. 进度更新状态
3. 新获得状态
4. 展示模式状态

## 17. 新用户引导 (/onboarding)

### 步骤概览
1. 基本信息 (/onboarding)
2. 人生阶段 (/onboarding/step2)
3. 生活水平 (/onboarding/step3)
4. 人生目标 (/onboarding/step4)

### 17.1 基本信息页
#### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："开启智能财富决策人生"
  - 跳过按钮
- 内容区域
  - 年龄段选择
  - 性别选择
  - 下一步按钮

#### 核心数据结构
```typescript
interface AgeGroup {
  value: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface UserBasicInfo {
  age: string;
  gender: 'male' | 'female' | null;
}
```

### 17.2 人生阶段页
#### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："选择人生阶段"
  - 跳过按钮
- 内容区域
  - 生命阶段选项
  - 导航按钮

#### 生命阶段数据
```typescript
interface LifeStage {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const lifeStages = [
  { id: 'student', title: '学生', description: '正在学习，为未来做准备' },
  { id: 'fresh_graduate', title: '应届毕业生', description: '刚毕业，寻找人生方向' },
  // ... 其他阶段
]
```

### 17.3 生活水平页
#### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："生活水平信息"
- 内容区域
  - 财务状况
  - 住房状况
  - 就业状况
  - 生活方式

#### 状态数据结构
```typescript
interface LifestyleInfo {
  financialStatus: string;
  housingStatus: string;
  employmentStatus: string;
  lifestyleStatus: string;
}

interface StatusOption {
  main: string;
  sub: string;
  colorScheme: string;
}
```

### 17.4 人生目标页
#### 页面布局
- 顶部导航栏
  - 返回按钮
  - 页面标题："人生目标"
- 内容区域
  - 短期愿望
  - 中期规划
  - 长期愿景
  - 完成动画

#### 目标数据结构
```typescript
interface LifeGoals {
  shortTermGoal: string;
  midTermGoal: string;
  longTermGoal: string;
}

interface GoalOption {
  main: string;
  sub: string;
  colorScheme: string;
}
```

### 交互特性
1. 表单验证
   - 必填项检查
   - 完整性验证
   - 错误提示

2. 页面导航
   - 步骤切换
   - 进度保持
   - 跳过确认

3. 动画效果
   - 选项卡片动画
   - 页面切换过渡
   - 完成动画展示

4. 响应式布局
   - 移动端适配
   - 网格布局自适应
   - 文字大小调整

### 状态管理
1. 用户输入
   - 表单数据
   - 选择状态
   - 验证状态

2. 导航状态
   - 当前步骤
   - 完成状态
   - 跳过状态

### 数据流
1. 数据收集
   - 基本信息
   - 生活状态
   - 目标规划

2. 数据存储
   - 本地存储
   - API提交
   - 状态同步

### 错误处理
1. 表单验证
2. 网络请求
3. 状态保持
4. 异常恢复

## 18. 用户认证

### 18.1 登录页面 (/login)
#### 页面布局
- 主体内容
  - 标题："登录"
  - 登录表单
  - 注册入口

#### 表单数据结构
```typescript
interface LoginForm {
  username: string;
  password: string;
}

interface LoginState {
  showPassword: boolean;
  isLoading: boolean;
  error?: string;
}
```

#### 交互特性
1. 表单验证
   - 用户名必填
   - 密码必填
   - 错误提示

2. 密码显示切换
   - 明文/密文切换
   - 图标动态变化

3. 登录流程
   - 表单提交
   - 加载状态
   - 错误处理
   - 成功跳转

### 18.2 注册页面 (/register)
#### 页面布局
- 主体内容
  - 标题："注册"
  - 注册表单
  - 登录入口

#### 表单数据结构
```typescript
interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

interface RegisterState {
  showPassword: boolean;
  isLoading: boolean;
  error?: string;
}
```

#### 验证规则
```typescript
const validationRules = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    minLength: 6,
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  }
}
```

### 共享特性
1. 视觉样式
```typescript
const formStyles = {
  container: 'min-h-screen bg-gray-50 flex items-center justify-center p-4',
  card: 'w-full max-w-md p-6',
  input: 'w-full pr-10',
  button: 'w-full bg-blue-600 hover:bg-blue-700 text-white'
}
```

2. 错误处理
   - 表单验证错误
   - 网络请求错误
   - 服务器响应错误
   - 用户反馈提示

3. 状态管理
   - 表单数据状态
   - 加载状态
   - 错误状态
   - 验证状态

4. 安全特性
   - 密码加密
   - 表单防重复提交
   - XSS 防护
   - CSRF 防护

5. 路由控制
   - 登录后跳转
   - 注册后引导
   - 会话保持
   - 路由保护

### API 接口
```typescript
interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  error?: string;
}

interface AuthError {
  code: string;
  message: string;
  field?: string;
}
```

### 数据流
1. 用户输入
   - 表单数据收集
   - 实时验证
   - 状态更新

2. 认证流程
   - 表单提交
   - 数据验证
   - API 请求
   - 响应处理

3. 状态存储
   - Token 管理
   - 用户信息
   - 会话状态

