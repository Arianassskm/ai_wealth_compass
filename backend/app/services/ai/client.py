from typing import Dict, Any
import httpx
from app.core.config import settings

class AIServiceClient:
    def __init__(self):
        self.base_url = settings.AI_MODEL_ENDPOINT
        self.api_key = settings.AI_MODEL_KEY
        self.client = httpx.AsyncClient()
    
    async def generate_prediction(self, user_profile: Dict[str, Any]):
        prompt = self.generate_prompt(user_profile)
        try:
            response = await self.client.post(
                f"{self.base_url}/predict",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"prompt": prompt}
            )
            response.raise_for_status()
            return await self.parse_response(response.json())
        except httpx.HTTPError as e:
            logger.error(f"AI service error: {str(e)}")
            raise APIError("AI service unavailable", 503)



