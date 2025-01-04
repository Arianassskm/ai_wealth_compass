from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List, Optional, Dict

from app.models.investment import Portfolio, Investment
from app.schemas import investment as schemas
from app.core.exceptions import InvestmentException
from app.services import algorithm_service

class InvestmentService:
    def __init__(self):
        self.algorithm_service = algorithm_service.AlgorithmService()

    async def create_portfolio(
        self,
        db: Session,
        user_id: int,
        portfolio: schemas.PortfolioCreate
    ) -> Portfolio:
        """创建投资组合"""
        try:
            # 验证资产配置比例
            if not self._validate_allocation(portfolio.target_allocation):
                raise InvestmentException("Invalid asset allocation")

            db_portfolio = Portfolio(
                user_id=user_id,
                risk_level=portfolio.risk_level,
                target_allocation=portfolio.target_allocation,
                current_allocation=portfolio.target_allocation,
                total_value=portfolio.initial_investment,
                investment_horizon=portfolio.investment_horizon
            )
            
            db.add(db_portfolio)
            db.commit()
            db.refresh(db_portfolio)
            return db_portfolio
            
        except Exception as e:
            db.rollback()
            raise InvestmentException(f"Error creating portfolio: {str(e)}")

    async def adjust_portfolio(
        self,
        db: Session,
        user_id: int,
        adjustment: schemas.PortfolioAdjustment
    ) -> Portfolio:
        """调整投资组合"""
        try:
            portfolio = await self.get_current_portfolio(db, user_id)
            if not portfolio:
                raise InvestmentException("Portfolio not found")

            # 验证调整是否合理
            new_allocation = self._calculate_new_allocation(
                portfolio.current_allocation,
                adjustment.adjustments
            )
            
            if not self._validate_allocation(new_allocation):
                raise InvestmentException("Invalid portfolio adjustment")

            # 执行调整
            portfolio.current_allocation = new_allocation
            portfolio.updated_at = datetime.utcnow()
            
            # 记录调整原因
            if adjustment.reason:
                portfolio.adjustment_history.append({
                    "date": datetime.utcnow(),
                    "changes": adjustment.adjustments,
                    "reason": adjustment.reason
                })

            db.commit()
            db.refresh(portfolio)
            return portfolio
            
        except Exception as e:
            db.rollback()
            raise InvestmentException(f"Error adjusting portfolio: {str(e)}")

    async def analyze_investments(
        self,
        db: Session,
        user_id: int,
        start_date: Optional[date],
        end_date: Optional[date]
    ) -> schemas.InvestmentAnalysis:
        """分析投资表现"""
        try:
            # 获取投资数据
            portfolio = await self.get_current_portfolio(db, user_id)
            
            # 计算各项指标
            return_metrics = await self._calculate_return_metrics(
                portfolio, start_date, end_date
            )
            risk_metrics = await self._calculate_risk_metrics(
                portfolio, start_date, end_date
            )
            diversification = await self._analyze_diversification(portfolio)
            
            return schemas.InvestmentAnalysis(
                period_start=start_date or portfolio.created_at.date(),
                period_end=end_date or datetime.utcnow().date(),
                total_return=return_metrics["total_return"],
                return_rate=return_metrics["return_rate"],
                risk_metrics=risk_metrics,
                asset_performance=await self._get_asset_performance(portfolio),
                rebalancing_needed=await self._check_rebalancing_need(portfolio),
                diversification_score=diversification["score"]
            )
            
        except Exception as e:
            raise InvestmentException(f"Error analyzing investments: {str(e)}")

    async def get_recommendations(
        self,
        db: Session,
        user_id: int
    ) -> List[schemas.InvestmentRecommendation]:
        """获取投资建议"""
        try:
            portfolio = await self.get_current_portfolio(db, user_id)
            user_profile = await self._get_user_profile(db, user_id)
            
            # 使用算法服务生成建议
            recommendations = await self.algorithm_service.generate_investment_recommendations(
                portfolio,
                user_profile
            )
            
            return recommendations
            
        except Exception as e:
            raise InvestmentException(
                f"Error generating investment recommendations: {str(e)}"
            )

investment_service = InvestmentService()