# 页面数据结构

## 目录
- [首页相关](#首页相关)
- [预算管理相关](#预算管理相关) 
- [投资组合相关](#投资组合相关)
- [用户认证相关](#用户认证相关)
- [个人资料相关](#个人资料相关)
- [新用户引导相关](#新用户引导相关)
- [通知相关](#通知相关)
- [勋章相关](#勋章相关)
- [理财目标相关](#理财目标相关)
- [消费记录相关](#消费记录相关)
- [储蓄计划相关](#储蓄计划相关)
- [市场资讯相关](#市场资讯相关)
- [风险评估相关](#风险评估相关)
- [AI助手相关](#AI助手相关)
- [账户设置相关](#账户设置相关)
- [理财产品相关](#理财产品相关)
- [生命阶段相关](#生命阶段相关)
- [资产管理相关](#资产管理相关)
- [消费决策相关](#消费决策相关)
- [预警配置相关](#预警配置相关)
- [通用数据类型](#通用数据类型)

## 通用数据类型
```typescript
interface AuditFields {
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_deleted?: boolean;
  version?: number;
}

interface UserSettings extends AuditFields {
  id: string;
  user_id: string;
  preference_type: string;
  preference_value: any;
}

interface LifeStage extends AuditFields {
  id: string;
  stage_type: string;
  characteristics: Record<string, any>;
  default_config: Record<string, any>;
  transition_period: boolean;
}

interface PersonaTemplate extends AuditFields {
  id: string;
  stage_id: string;
  template_name: string;
  default_settings: Record<string, any>;
  applicable_conditions: Record<string, any>;
}

interface AssetChange extends AuditFields {
  id: string;
  asset_id: string;
  change_type: string;
  change_amount: number;
  change_reason?: string;
  change_time: string;
  created_by?: string;
}

interface AlertRule extends AuditFields {
  id: string;
  rule_type: string;
  threshold_value: number;
  condition_expression: string;
  action_type: string;
}

interface AlertRecord extends AuditFields {
  id: string;
  rule_id: string;
  trigger_time: string;
  alert_status: string;
  resolution_status: string;
}
```

## 首页相关

### 可支配收入分析
```typescript
interface IncomeMetric {
  title: string;
  amount: number;
  trend: number;
  subtitle: string;
}
```

### 预算监控
```typescript
interface BudgetCategory {
  title: string;
  percentage: number;
  amount: number;
  total: number;
  color: string;
  thresholds: {
    color: string;
    amount: number;
    label: string;
  }[];
  subcategories: {
    name: string;
    amount: number;
  }[];
}
```

### 收支趋势
```typescript
interface TrendData {
  date: string;
  value: number;
}

interface Milestone {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  message: string;
}
```

## 预算管理相关
```typescript
interface Budget {
  id: string;
  category: string;
  planned: number;
  actual: number;
  remaining: number;
  progress: number;
  startDate: string;
  endDate: string;
}

interface BudgetAlert {
  type: 'warning' | 'danger' | 'success';
  message: string;
  category: string;
  threshold: number;
}
```

## 投资组合相关
```typescript
interface Portfolio {
  id: string;
  name: string;
  type: 'stocks' | 'bonds' | 'funds' | 'crypto';
  amount: number;
  returns: number;
  risk: 'low' | 'medium' | 'high';
  lastUpdate: string;
}

interface PortfolioPerformance {
  period: string;
  return: number;
  benchmark: number;
}
```

## 用户认证相关

### 登录页面
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

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  error?: string;
}

### 注册页面
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

## 新用户引导相关

### 基本信息页
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

### 人生阶段页
```typescript
interface LifeStage {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}
```

### 生活水平页
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

### 人生目标页
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

## 通知相关
```typescript
interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'warning' | 'info';
}

interface NotificationSettings {
  budgetAlerts: boolean;
  savingsGoals: boolean;
  investmentUpdates: boolean;
  securityAlerts: boolean;
}
```

## 勋章相关
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

## 理财目标相关
```typescript
interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  category: 'education' | 'housing' | 'retirement' | 'travel' | 'other';
  milestones: {
    amount: number;
    date: string;
    achieved: boolean;
  }[];
}

interface GoalProgress {
  percentage: number;
  monthlyRequired: number;
  projectedCompletion: string;
  suggestions: string[];
}
```

## 消费记录相关
```typescript
interface Expense {
  id: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  description: string;
  paymentMethod: string;
  location?: string;
  tags: string[];
  attachments?: string[];
}

interface ExpenseAnalytics {
  totalSpent: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  trends: {
    period: string;
    amount: number;
  }[];
}
```

## 储蓄计划相关
```typescript
interface SavingsPlan {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  type: 'emergency' | 'short-term' | 'long-term';
  autoDeduct: boolean;
}

interface SavingsProjection {
  month: string;
  balance: number;
  contribution: number;
  interest: number;
  totalInterest: number;
}
```

## 市场资讯相关
```typescript
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishDate: string;
  category: 'market' | 'policy' | 'analysis' | 'tips';
  tags: string[];
  relatedProducts?: string[];
  impact: 'positive' | 'negative' | 'neutral';
}

interface MarketIndicator {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  updateTime: string;
}
```

## 风险评估相关
```typescript
interface RiskAssessment {
  id: string;
  score: number;
  level: 'conservative' | 'moderate' | 'aggressive';
  date: string;
  factors: {
    category: string;
    score: number;
    weight: number;
    answers: {
      question: string;
      answer: string;
      score: number;
    }[];
  }[];
}

interface RiskProfile {
  overallScore: number;
  riskTolerance: string;
  investmentHorizon: string;
  recommendedAllocation: {
    assetClass: string;
    percentage: number;
    description: string;
  }[];
  restrictions: string[];
}
```

## AI助手相关
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: {
    type: string;
    url: string;
  }[];
}

interface AnalysisResult {
  type: 'recommendation' | 'warning' | 'insight';
  title: string;
  description: string;
  confidence: number;
  actions?: {
    label: string;
    action: string;
    params?: Record<string, any>;
  }[];
}
```

## 账户设置相关
```typescript
interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  privacy: {
    dataSharing: boolean;
    analyticsOptIn: boolean;
    marketingOptIn: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    trustedDevices: string[];
  };
  preferences: {
    language: string;
    currency: string;
    theme: 'light' | 'dark' | 'system';
    dateFormat: string;
  };
}
```

## 理财产品相关
```typescript
interface FinancialProduct {
  id: string;
  name: string;
  type: 'fund' | 'insurance' | 'deposit' | 'bond' | 'stock';
  risk: 1 | 2 | 3 | 4 | 5;  // 风险等级1-5
  returns: {
    expected: number;
    historical: number;
    guaranteed?: number;
  };
  period: {
    min: number;
    max: number;
    unit: 'day' | 'month' | 'year';
  };
  investment: {
    minimum: number;
    maximum?: number;
    increment: number;
  };
  features: string[];
  tags: string[];
  status: 'available' | 'sold_out' | 'coming_soon';
}

interface ProductRecommendation {
  productId: string;
  score: number;
  reasons: string[];
  matchDegree: number;
  riskMatch: boolean;
  suitabilityFactors: {
    factor: string;
    score: number;
  }[];
}
```

## 通用数据类型

### 金额相关
```typescript
interface MoneyAmount {
  value: number;
  currency: string;
  formatted: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: MoneyAmount;
  date: string;
  category: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
}
```

### 时间相关
```typescript
interface DateRange {
  start: string;
  end: string;
  label?: string;
}

interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}
```

### 进度相关
```typescript
interface Progress {
  current: number;
  target: number;
  percentage: number;
  status: 'on_track' | 'at_risk' | 'behind';
  projectedCompletion?: string;
}

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  description?: string;
}
```

### 用户偏好
```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    dataSharing: boolean;
    marketingOptIn: boolean;
  };
}
```

### 错误处理
```typescript
interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

### 分页和过滤
```typescript
interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

interface FilterOptions {
  dateRange?: DateRange;
  categories?: string[];
  status?: string[];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

### 统计和分析
```typescript
interface Analytics {
  period: DateRange;
  summary: {
    total: number;
    average: number;
    change: number;
    changePercentage: number;
  };
  breakdown: {
    category: string;
    value: number;
    percentage: number;
  }[];
  trends: TimeSeriesData[];
}

interface Comparison {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}
```

### 系统配置
```typescript
interface SystemConfig {
  features: {
    name: string;
    enabled: boolean;
    config?: Record<string, any>;
  }[];
  limits: {
    maxFileSize: number;
    maxItems: number;
    rateLimit: number;
  };
  maintenance: {
    enabled: boolean;
    message?: string;
    plannedEnd?: string;
  };
}
```
