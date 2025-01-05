"""DeepSeek API 客户端"""
import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger

class DeepSeekClient:
    """DeepSeek API 客户端类"""
    
    def __init__(self):
        """初始化客户端"""
        self.api_key = settings.DEEPSEEK_API_KEY
        self.base_url = settings.DEEPSEEK_API_BASE_URL
        self.model = settings.DEEPSEEK_MODEL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        发送聊天请求到DeepSeek API
        
        Args:
            messages: 消息列表，格式为[{"role": "user", "content": "消息内容"}]
            temperature: 温度参数，控制响应的随机性
            max_tokens: 最大生成token数
            
        Returns:
            API响应结果
        """
        try:
            url = f"{self.base_url}/v1/chat/completions"
            
            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature or settings.DEEPSEEK_TEMPERATURE,
                "max_tokens": max_tokens or settings.DEEPSEEK_MAX_TOKENS
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    headers=self.headers,
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
                
        except Exception as e:
            logger.error(f"DeepSeek API调用失败: {str(e)}")
            raise
    
    async def analyze_financial_data(
        self,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        分析财务数据
        
        Args:
            context: 财务数据上下文
            
        Returns:
            分析结果
        """
        messages = [
            {
                "role": "system",
                "content": "你是一个专业的财务分析师，专注于个人理财分析和建议。"
            },
            {
                "role": "user",
                "content": self._build_analysis_prompt(context)
            }
        ]
        
        response = await self.chat_completion(messages)
        return self._parse_analysis_response(response)
    
    def _build_analysis_prompt(self, context: Dict[str, Any]) -> str:
        """构建分析提示词"""
        return f"""
        请基于以下信息进行财务分析：
        
        用户背景：
        - 年龄：{context.get('age', 'unknown')}
        - 收入：{context.get('income', 'unknown')}
        - 支出：{context.get('expenses', 'unknown')}
        - 储蓄：{context.get('savings', 'unknown')}
        - 投资：{context.get('investments', 'unknown')}
        
        请提供：
        1. 财务状况评估
        2. 风险分析
        3. 投资建议
        4. 预算规划
        5. 理财目标建议
        """
    
    def _parse_analysis_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """解析API响应"""
        try:
            content = response['choices'][0]['message']['content']
            # 这里可以添加更复杂的响应解析逻辑
            return {
                "analysis": content,
                "status": "success"
            }
        except Exception as e:
            logger.error(f"解析DeepSeek响应失败: {str(e)}")
            return {
                "analysis": "分析失败",
                "status": "error",
                "error": str(e)
            }

# 创建客户端实例
deepseek_client = DeepSeekClient() 