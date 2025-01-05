from typing import Dict, Any
from app.core.config import settings
from app.utils.logger import logger
from app.services.ai.base import BaseAIAnalyzer

class SocialGiftAnalyzer(BaseAIAnalyzer):
    """人情往来AI分析器
    专注于分析人情场景并提供建议
    """
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """分析人情场景"""
        try:
            # 构建场景特定的提示词
            prompt = self._build_prompt(context)
            
            # 获取AI响应
            response = await self._get_ai_response(prompt)
            
            # 解析并格式化结果
            return self._format_response(response)
            
        except Exception as e:
            logger.error(f"人情分析失败: {str(e)}")
            raise
            
    def _build_prompt(self, context: Dict[str, Any]) -> str:
        """构建分析提示词"""
        return f"""
        请基于以下场景信息提供人情往来建议:
        地点: {context['location']}
        时间: {context['event_time']}
        关系: {context['relationship']}
        场景: {context['scenario']}
        
        请提供:
        1. 建议的礼金/礼物范围
        2. 建议的依据
        3. 需要注意的事项
        4. 当地习俗参考
        """ 