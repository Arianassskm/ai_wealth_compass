from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Numeric, JSON
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.models.base import Base

class Account(Base):
    """账户表"""
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    balance: Mapped[float] = mapped_column(Numeric(precision=15, scale=2), default=0.0)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关联关系
    user: Mapped["User"] = relationship("User", back_populates="accounts")
    wealth_components: Mapped[List["WealthComponent"]] = relationship("WealthComponent", back_populates="account")
    wealth_snapshots: Mapped[List["WealthSnapshot"]] = relationship("WealthSnapshot", back_populates="account")

class WealthComponent(Base):
    """财富组成表"""
    __tablename__ = "wealth_components"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(precision=15, scale=2), default=0.0)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关联关系
    account: Mapped["Account"] = relationship("Account", back_populates="wealth_components")

class WealthSnapshot(Base):
    """财富快照表"""
    __tablename__ = "wealth_snapshots"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"), nullable=False, index=True)
    total_amount: Mapped[float] = mapped_column(Numeric(precision=15, scale=2), default=0.0)
    snapshot_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关联关系
    account: Mapped["Account"] = relationship("Account", back_populates="wealth_snapshots") 
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    total_amount = Column(Numeric(15, 2), nullable=False)
    snapshot_date = Column(DateTime, nullable=False, index=True)
    components = Column(JSON)  # 各组成部分的快照
    
    # 关联关系
    user = relationship("User", back_populates="wealth_snapshots") 