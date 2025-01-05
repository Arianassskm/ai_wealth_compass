"""投资/辞职AI分析器"""
from typing import Dict, Any
from app.services.ai.base import BaseAIAnalyzer
from app.utils.logger import logger

class InvestmentResignationAnalyzer(BaseAIAnalyzer):
    """投资/辞职决策AI分析器"""
    
    async def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """分析投资/辞职决策"""
        try:
            # 构建场景特定的提示词
            prompt = self._build_prompt(context)
            
            # 获取AI响应
            response = await self._get_ai_response(prompt)
            
            # 解析并格式化结果
            return self._format_response(response)
            
        except Exception as e:
            logger.error(f"投资/辞职分析失败: {str(e)}")
            raise
            
    def _build_prompt(self, context: Dict[str, Any]) -> str:
        """构建分析提示词"""
        decision_type = "投资" if context['decision_type'] == 'investment' else "辞职"
        
        base_prompt = f"""
        请作为一位专业的财务顾问，分析以下{decision_type}决策：
        
        基本信息：
        - 决策类型：{decision_type}
        - 涉及金额：{context['amount']}元
        - 时间框架：{context['timeframe']}
        - 当前储蓄：{context['current_savings']}元
        """
        
        if context['decision_type'] == 'investment':
            base_prompt += f"""
            投资详情：
            - 投资类型：{context['investment_type']}
            
            请提供：
            1. 可行性分析（评分0-100）
            2. SWOT分析
            3. 风险评估和缓解建议
            4. 具体投资建议
            5. 潜在机会和挑战
            """
        else:
            base_prompt += f"""
            辞职详情：
            - 辞职原因：{context['resignation_reason']}
            
            请提供：
            1. 可行性分析（评分0-100）
            2. SWOT分析
            3. 风险评估和缓解建议
            4. 过渡期建议
            5. 潜在机会和挑战
            """
            
        return base_prompt
        
    def _format_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """格式化AI响应"""
        try:
            return {
                'analysis_result': {
                    'feasibility_score': response.get('feasibility_score', 0),
                    'key_findings': response.get('key_findings', []),
                    'swot_analysis': response.get('swot_analysis', {})
                },
                'risk_assessment': {
                    'level': response.get('risk_level', 'medium'),
                    'factors': response.get('risk_factors', []),
                    'mitigation': response.get('risk_mitigation', [])
                },
                'recommendations': response.get('recommendations', []),
                'opportunities': response.get('opportunities', []),
                'challenges': response.get('challenges', [])
            }
        except Exception as e:
            logger.error(f"响应格式化失败: {str(e)}")
            raise 