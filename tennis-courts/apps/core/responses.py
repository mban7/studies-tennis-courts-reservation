from typing import Optional
from rest_framework.response import Response

def api_response(data: Optional[dict] = None, message: Optional[str] = None, status_code: int = 200) -> Response:
    response = {}

    if data is not None:
        response["data"] = data

    if message is not None:
        response["message"] = message

    return Response(
        response,
        status=status_code,
    )