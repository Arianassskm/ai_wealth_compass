class CacheManager:
    @staticmethod
    async def get_cached_prediction(user_id: int) -> Optional[Dict]:
        pass

    @staticmethod
    async def cache_prediction(
        user_id: int,
        prediction: Dict,
        expiry: int = 3600
    ) -> None:
        pass