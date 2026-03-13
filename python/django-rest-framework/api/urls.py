from django.urls import path

from . import views

urlpatterns = [
    path("time/", views.current_time),
]
