# Django
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

# DRF
from rest_framework import generics, permissions, viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

# Tu app
from .models import MenuItem, Order
from .serializers import (
    UserSerializer,
    MenuItemSerializer,
    OrderSerializer,
)


class MenuItemListView(generics.ListAPIView):
    queryset = MenuItem.objects.all().order_by('id')
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()

        token = Token.objects.create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
    
    from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer

# 1) Crear un pedido (desde el carrito)
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}

# 2) Ver mis pedidos
class UserOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(usuario=self.request.user).order_by('-fecha_creacion')

# 3) ViewSet para administración
class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-fecha_creacion')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['post'])
    def marcar_entregado(self, request, pk=None):
        pedido = self.get_object()
        pedido.estado = 'ENTREGADO'
        pedido.save()
        return Response({'estado': 'ENTREGADO'}, status=status.HTTP_200_OK)
