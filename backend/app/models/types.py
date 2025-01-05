"""通用类型定义"""
import enum

class UserRole(str, enum.Enum):
    """用户角色"""
    ADMIN = "admin"
    USER = "user"
    VIP = "vip"

class AccountType(str, enum.Enum):
    """账户类型"""
    SAVINGS = "savings"
    CHECKING = "checking"
    CREDIT = "credit"
    INVESTMENT = "investment"
    DIGITAL = "digital"

class AccountStatus(str, enum.Enum):
    """账户状态"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    FROZEN = "frozen"
    CLOSED = "closed"

class RiskLevel(str, enum.Enum):
    """风险等级"""
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"

class InvestmentStyle(str, enum.Enum):
    """投资风格"""
    CONSERVATIVE = "conservative"
    BALANCED = "balanced"
    AGGRESSIVE = "aggressive"
    VALUE = "value"
    GROWTH = "growth"

class TransactionType(str, enum.Enum):
    """交易类型"""
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"
    INVESTMENT = "investment"
    DIVIDEND = "dividend"
    FEE = "fee"

class TransactionStatus(str, enum.Enum):
    """交易状态"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class AnalysisType(str, enum.Enum):
    """分析类型"""
    INVESTMENT = "investment"
    RESIGNATION = "resignation"
    FINANCIAL = "financial"
    RISK = "risk" 