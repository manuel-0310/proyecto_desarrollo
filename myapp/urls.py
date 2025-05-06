
from django.urls import path
from .views import RegisterView, LoginView, ProfileView, authors

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/',    LoginView.as_view(),    name='login'),
    path('profile/',  ProfileView.as_view(),  name='profile'),
    path('authors/',  authors,                name='authors'),
]

