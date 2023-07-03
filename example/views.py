# example/views.py
from datetime import datetime

from django.shortcuts import render


def index(request):
    template_name = 'example/index.html'
    context = {
        'horario': datetime.now()
    }
    return render(request, template_name, context)
