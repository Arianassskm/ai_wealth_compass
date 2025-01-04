from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import datetime
from backend.app.models.user.account import AccountType

class AccountBase(BaseModel):
    name: str
    account_type: AccountType
    currency: str = "CNY"
    description: Optional[str] = None

class AccountCreate(AccountBase):
    pass

class AccountUpdate(BaseModel):
    name: Optional[str] = None
    account_type: Optional[AccountType] = None
    balance: Optional[condecimal(max_digits=15, decimal_places=2)] = None
    currency: Optional[str] = None
    description: Optional[str] = None

class AccountInDB(AccountBase):
    id: int
    user_id: int
    balance: condecimal(max_digits=15, decimal_places=2)
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AccountResponse(AccountInDB):
    pass