import logging
from typing import Any

class CustomLogger:
    @staticmethod
    def log_prediction(
        user_id: int,
        prediction_data: Dict[str, Any],
        confidence: float
    ) -> None:
        pass

    @staticmethod
    def log_user_action(
        user_id: int,
        action: str,
        details: Dict[str, Any]
    ) -> None:
        pass

