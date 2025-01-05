"""AI服务客户端"""
from typing import Dict, Any
from app.services.ai.deepseek_client import deepseek_client
from app.core.logging import logger

class AIServiceClient:
    """AI服务客户端类"""
    
    async def generate_user_profile(
        self, 
        user_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """生成用户画像"""
        prompt = f"""
        请基于以下用户信息生成详细的用户画像：
        
        基本信息：
        - 年龄：{user_data.get('age')}
        - 职业：{user_data.get('occupation')}
        - 收入：{user_data.get('income')}
        - 家庭状况：{user_data.get('family_status')}
        
        财务状况：
        - 月收入：{user_data.get('monthly_income')}
        - 固定支出：{user_data.get('fixed_expenses')}
        - 储蓄情况：{user_data.get('savings')}
        - 投资经验：{user_data.get('investment_experience')}
        
        请提供：
        1. 用户画像总结
        2. 理财风格分析
        3. 风险承受能力评估
        4. 投资偏好建议
        5. 理财目标规划
        """
        
        messages = [
            {
                "role": "system",
                "content": "你是一个专业的理财顾问，擅长分析用户画像并提供个性化建议。"
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
        
        try:
            response = await deepseek_client.chat_completion(messages)
            return self._parse_profile_response(response)
        except Exception as e:
            logger.error(f"生成用户画像失败: {str(e)}")
            raise
    
    async def generate_financial_advice(
        self, 
        profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """生成财务建议"""
        prompt = f"""
        基于用户画像生成详细的财务建议：
        
        用户画像：
        {profile.get('summary', '暂无画像信息')}
        
        风险承受能力：{profile.get('risk_tolerance', '中等')}
        投资偏好：{profile.get('investment_preference', '稳健型')}
        
        请提供：
        1. 资产配置建议
        2. 投资组合推荐
        3. 理财产品选择
        4. 风险控制措施
        5. 定期复盘建议
        """
        
        messages = [
            {
                "role": "system",
                "content": "你是一个专业的投资顾问，擅长提供个性化的财务建议。"
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
        
        try:
            response = await deepseek_client.chat_completion(messages)
            return self._parse_advice_response(response)
        except Exception as e:
            logger.error(f"生成财务建议失败: {str(e)}")
            raise
    
    def _parse_profile_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """解析用户画像响应"""
        try:
            content = response['choices'][0]['message']['content']
            return {
                "profile": content,
                "status": "success"
            }
        except Exception as e:
            logger.error(f"解析用户画像响应失败: {str(e)}")
            return {
                "profile": "生成失败",
                "status": "error",
                "error": str(e)
            }
    
    def _parse_advice_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """解析财务建议响应"""
        try:
            content = response['choices'][0]['message']['content']
            return {
                "advice": content,
                "status": "success"
            }
        except Exception as e:
            logger.error(f"解析财务建议响应失败: {str(e)}")
            return {
                "advice": "生成失败",
                "status": "error",
                "error": str(e)
            }

# 创建客户端实例
ai_service_client = AIServiceClient()



