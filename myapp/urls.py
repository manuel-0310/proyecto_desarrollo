from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView,
    OrderCreateView, UserOrdersView, AdminOrderViewSet, MenuItemListView
)

router = DefaultRouter()
router.register(r'admin/pedidos', AdminOrderViewSet, basename='admin-pedidos')

urlpatterns = [
    path('api/register/', RegisterView.as_view(),   name='register'),
    path('api/login/',    LoginView.as_view(),      name='login'),
    path('api/pedidos/',  OrderCreateView.as_view(),name='crear-pedido'),
    path('api/mis-pedidos/', UserOrdersView.as_view(), name='mis-pedidos'),
    path('api/menu-items/', MenuItemListView.as_view(), name='menu-items'),
    path('api/', include(router.urls)),
]
