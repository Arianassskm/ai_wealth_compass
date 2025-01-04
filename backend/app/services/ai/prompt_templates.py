from string import Template

class PromptTemplates:
    INITIAL_PREDICTION = Template("""
    基于以下用户信息生成财务预测：
    年龄段: ${age_group}
    生命阶段: ${life_stage}
    财务状况: ${financial_status}
    生活方式: ${lifestyle}
    短期目标: ${short_term_goal}
    长期目标: ${long_term_goal}
    
    请提供以下方面的具体预测：
    1. 月度预算分配
    2. 投资组合建议
    3. 理财目标规划
    4. 风险评估
    """)