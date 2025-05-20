from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView,
    OrderCreateView, UserOrdersView, AdminOrderViewSet, MenuItemListView)
from .views import list_categories, list_dishes
from django.urls import path
from .views import PedidoListCreateAPIView, PedidoRetrieveUpdateAPIView
   
router = DefaultRouter()
router.register(r'admin/pedidos', AdminOrderViewSet, basename='admin-pedidos')

urlpatterns = [
    path('api/register/', RegisterView.as_view(),   name='register'),
    path('api/login/',    LoginView.as_view(),      name='login'),
    path('api/pedidos/',  OrderCreateView.as_view(),name='crear-pedido'),
    path('api/mis-pedidos/', UserOrdersView.as_view(), name='mis-pedidos'),
    path('api/menu-items/', MenuItemListView.as_view(), name='menu-items'),
    path('api/', include(router.urls)),
    path('api/pedidos/', PedidoListCreateAPIView.as_view(), name='pedidos-list-create'),
    path('api/pedidos/<int:pk>/', PedidoRetrieveUpdateAPIView.as_view(), name='pedido-update'),
    path('categories/', list_categories, name='categories'),
    path('dishes/',     list_dishes,     name='dishes'),
]
