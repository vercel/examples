from django.conf import settings


def read_only(request):
    return {"read_only": settings.READ_ONLY}
