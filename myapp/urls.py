from django.urls import path
from .views import (
    list_categories,
    list_dishes,
    RegisterView,
    LoginView,
    ProfileView,
    PedidoListCreateAPIView,
    PedidoRetrieveUpdateAPIView,
)

urlpatterns = [
    # Menú
    path('categories/', list_categories, name='categories'),
    path('dishes/',     list_dishes,     name='dishes'),

    # Autenticación
    path('register/',   RegisterView.as_view(),             name='register'),
    path('login/',      LoginView.as_view(),                name='login'),
    path('profile/',    ProfileView.as_view(),              name='profile'),

    # Pedidos
    path('orders/',          PedidoListCreateAPIView.as_view(),   name='orders'),
    path('orders/<int:pk>/', PedidoRetrieveUpdateAPIView.as_view(), name='order-detail'),
]
