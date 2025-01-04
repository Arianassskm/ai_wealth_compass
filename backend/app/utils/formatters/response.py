from typing import Any, Optional

def format_response(
    data: Any,
    message: Optional[str] = None,
    status_code: int = 200
) -> Dict:
    return {
        "status": "success" if status_code < 400 else "error",
        "message": message,
        "data": data
    }
