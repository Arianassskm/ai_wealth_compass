from typing import Dict, Any
from app.services.ai.social_analyzer import SocialGiftAnalyzer
from app.models.algorithm.social.gift_record import GiftRecord
from app.core.cache import AsyncCache

class SocialGiftService:
    """人情往来服务
    负责处理人情往来相关的业务逻辑
    """
    def __init__(self, db_session, cache: AsyncCache):
        self.db = db_session
        self.cache = cache
        self.analyzer = SocialGiftAnalyzer()

    async def analyze_gift_scenario(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """分析人情场景并提供建议"""
        cache_key = self._generate_cache_key(context)
        
        # 检查缓存
        if cached_result := await self.cache.get(cache_key):
            return cached_result
            
        # 获取分析结果
        result = await self.analyzer.analyze(context)
        
        # 保存记录
        await self._save_gift_record(context, result)
        
        # 设置缓存
        await self.cache.set(cache_key, result)
        
        return result

    async def _save_gift_record(self, context: Dict, analysis: Dict):
        """保存礼金记录"""
        record = GiftRecord(
            user_id=context["user_id"],
            scenario=context["scenario"],
            relationship=context["relationship"],
            amount=analysis.get("suggested_amount"),
            location=context["location"],
            event_time=context["event_time"]
        )
        self.db.add(record)
        await self.db.commit() 