from enum import Enum

class LifeStage(str, Enum):
    STUDENT = "student"
    FRESH_GRADUATE = "fresh_graduate"
    EARLY_CAREER = "early_career"
    MID_CAREER = "mid_career"
    PRE_RETIREMENT = "pre_retirement"
    RETIREMENT = "retirement"

class FinancialStatus(str, Enum):
    DEPENDENT = "dependent"
    SELF_SUFFICIENT = "self_sufficient"
    STABLE = "stable"
    WEALTHY = "wealthy"

class RiskLevel(str, Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"

class PredictionType(str, Enum):
    FINANCIAL = "financial"
    INVESTMENT = "investment"
    LIFECYCLE = "lifecycle" 