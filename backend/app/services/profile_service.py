from typing import Dict, Any, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user.user_profile import UserProfile
from app.services.ai.client import AIServiceClient
from app.core.logging import logger
from app.models.investment.preference import InvestmentPreference

class ProfileService:
    """
    用户画像服务
    处理用户画像的创建、更新和AI预测生成
    """
    def __init__(self, db: Session):
        self.db = db                    # 数据库会话
        self.ai_client = AIServiceClient()  # AI客户端实例
        
    async def create_initial_profile(
        self, 
        user_id: int,              # 用户ID
        profile_data: Dict[str, Any]  # 画像数据
    ) -> UserProfile:
        """
        创建初始用户画像
        
        步骤:
        1. 调用AI服务生成画像
        2. 将画像保存到数据库
        3. 返回创建的画像对象
        """
        try:
            # 创建基础画像
            profile = UserProfile(
                user_id=user_id,
                **profile_data
            )
            self.db.add(profile)
            await self.db.flush()
            
            # 创建投资偏好
            investment_pref = InvestmentPreference(
                profile_id=profile.id,
                risk_tolerance=profile_data.get("preferences", {}).get("risk_tolerance"),
                preferred_assets=profile_data.get("preferences", {}).get("preferred_assets"),
            )
            self.db.add(investment_pref)
            
            # 生成AI推荐
            ai_recommendation = await self.generate_ai_recommendation(profile)
            if ai_recommendation:
                self.db.add(ai_recommendation)
            
            await self.db.commit()
            await self.db.refresh(profile)
            return profile
            
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"创建用户画像失败: {str(e)}"
            )
            
    async def update_profile(
        self, 
        profile_id: int, 
        updates: Dict[str, Any]
    ) -> UserProfile:
        """更新用户画像"""
        profile = await self.db.query(UserProfile).get(profile_id)
        if not profile:
            raise HTTPException(status_code=404, detail="用户画像不存在")
            
        # 更新基础信息
        for key, value in updates.items():
            setattr(profile, key, value)
            
        # 重新生成AI画像
        new_ai_profile = await self.ai_client.generate_user_profile(
            self._prepare_profile_data(profile)
        )
        profile.ai_profile = new_ai_profile
        
        await self.db.commit()
        await self.db.refresh(profile)
        return profile

    async def analyze_profile_with_ai(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """使用AI分析用户画像数据"""
        try:
            # 调用AI服务进行分析
            ai_analysis = await self.ai_client.analyze_profile(profile_data)
            
            # 提取关键信息
            risk_assessment = ai_analysis.get("risk_assessment", {})
            investment_advice = ai_analysis.get("investment_advice", {})
            financial_planning = ai_analysis.get("financial_planning", {})
            
            # 更新用户画像
            return {
                "risk_assessment": risk_assessment,
                "investment_advice": investment_advice,
                "financial_planning": financial_planning
            }
            
        except Exception as e:
            logger.error(f"AI分析失败: {str(e)}")
            return {}