from django.urls import path
from .views import authors, RegisterView, LoginView, ProfileView

urlpatterns = [
    path('authors/', authors, name='authors'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/',    LoginView.as_view(),    name='login'),
    path('profile/',  ProfileView.as_view(),  name='profile'),
]


