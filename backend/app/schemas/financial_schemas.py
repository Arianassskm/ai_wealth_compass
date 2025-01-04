from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime, date
from enum import Enum

class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"

class CategoryType(str, Enum):
    SALARY = "salary"
    INVESTMENT = "investment"
    SHOPPING = "shopping"
    FOOD = "food"
    TRANSPORT = "transport"
    HOUSING = "housing"
    ENTERTAINMENT = "entertainment"
    OTHERS = "others"

class TransactionCreate(BaseModel):
    amount: float = Field(gt=0)
    transaction_type: TransactionType
    category: CategoryType
    description: Optional[str] = None
    date: date = Field(default_factory=date.today)

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    transaction_type: TransactionType
    category: CategoryType
    description: Optional[str]
    date: date
    created_at: datetime

    class Config:
        from_attributes = True

class BudgetCreate(BaseModel):
    month: date
    categories: Dict[CategoryType, float]
    total_amount: float = Field(gt=0)
    notes: Optional[str] = None

class BudgetResponse(BaseModel):
    id: int
    user_id: int
    month: date
    categories: Dict[CategoryType, float]
    total_amount: float
    spent_amount: float
    remaining_amount: float
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BudgetAnalysis(BaseModel):
    period_start: date
    period_end: date
    total_budget: float
    total_spent: float
    remaining: float
    category_analysis: Dict[CategoryType, Dict[str, float]]
    spending_trend: List[Dict[str, float]]
    recommendations: List[str]