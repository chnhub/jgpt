from django.urls import path
from apps.jgpt import views

urlpatterns = [
    path("", views.jgpt_root, name="home"),
    path("jgpt/<name>", views.hello_there, name="hello_there"),
    path("jgpt", views.jgpt_root, name='home'),
    path("menu/<name>", views.menu, name="<name>"),
    path("receiveRecord/<name>", views.receiveRecord, name="<name>"),
]