from datetime import datetime, timezone

from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def current_time(request):
    return Response({"time": datetime.now(timezone.utc).isoformat()})
