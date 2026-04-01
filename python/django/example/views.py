from datetime import datetime

from django.shortcuts import render


def index(request):
    return render(request, "example/index.html", {"now": datetime.now()})
