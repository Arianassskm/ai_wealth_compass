from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List, Optional, Dict

from app.models.financial import Transaction, Budget
from app.schemas import financial as schemas
from app.core.exceptions import FinancialException

class FinancialService:
    async def create_transaction(
        self,
        db: Session,
        user_id: int,
        transaction: schemas.TransactionCreate
    ) -> Transaction:
        """创建新交易记录"""
        db_transaction = Transaction(
            user_id=user_id,
            amount=transaction.amount,
            transaction_type=transaction.transaction_type,
            category=transaction.category,
            description=transaction.description,
            date=transaction.date
        )
        try:
            db.add(db_transaction)
            db.commit()
            db.refresh(db_transaction)
            
            # 更新相关预算
            await self._update_budget_after_transaction(
                db, user_id, db_transaction
            )
            
            return db_transaction
        except Exception as e:
            db.rollback()
            raise FinancialException(f"Error creating transaction: {str(e)}")

    async def create_budget(
        self,
        db: Session,
        user_id: int,
        budget: schemas.BudgetCreate
    ) -> Budget:
        """创建预算计划"""
        db_budget = Budget(
            user_id=user_id,
            month=budget.month,
            categories=budget.categories,
            total_amount=budget.total_amount,
            notes=budget.notes
        )
        try:
            db.add(db_budget)
            db.commit()
            db.refresh(db_budget)
            return db_budget
        except Exception as e:
            db.rollback()
            raise FinancialException(f"Error creating budget: {str(e)}")

    async def analyze_budget(
        self,
        db: Session,
        user_id: int,
        start_date: date,
        end_date: date
    ) -> schemas.BudgetAnalysis:
        """分析预算执行情况"""
        try:
            # 获取期间预算
            budgets = await self._get_period_budgets(
                db, user_id, start_date, end_date
            )
            
            # 获取期间交易
            transactions = await self._get_period_transactions(
                db, user_id, start_date, end_date
            )
            
            # 计算分析数据
            analysis = await self._calculate_budget_analysis(
                budgets, transactions
            )
            
            # 生成建议
            recommendations = await self._generate_budget_recommendations(
                analysis
            )
            
            return schemas.BudgetAnalysis(
                period_start=start_date,
                period_end=end_date,
                **analysis,
                recommendations=recommendations
            )
        except Exception as e:
            raise FinancialException(f"Error analyzing budget: {str(e)}")

    async def _update_budget_after_transaction(
        self,
        db: Session,
        user_id: int,
        transaction: Transaction
    ):
        """交易后更新预算"""
        current_budget = await self.get_current_budget(db, user_id)
        if current_budget:
            # 更新预算使用情况
            current_budget.spent_amount += (
                transaction.amount if transaction.transaction_type == "expense"
                else 0
            )
            current_budget.remaining_amount = (
                current_budget.total_amount - current_budget.spent_amount
            )
            db.commit()

financial_service = FinancialService()