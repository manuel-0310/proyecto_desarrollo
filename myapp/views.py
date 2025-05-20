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

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Pedido
from .serializers import PedidoSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Category, Dish
from .serializers import CategorySerializer, DishSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    cats = Category.objects.all()
    serializer = CategorySerializer(cats, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_dishes(request):
    dishes = Dish.objects.all()
    serializer = DishSerializer(dishes, many=True)
    return Response(serializer.data)


class IsAuthenticatedAdminOrOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

class PedidoListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticatedAdminOrOwner]

    def get_queryset(self):
        usuario = self.request.user
        estado = self.request.query_params.get("estado")
        cliente = self.request.query_params.get("cliente")

        queryset = Pedido.objects.all()
        if not usuario.is_staff:
            queryset = queryset.filter(usuario=usuario)

        if estado:
            queryset = queryset.filter(estado=estado)
        if cliente:
            queryset = queryset.filter(usuario_username_icontains=cliente)

        return queryset.order_by('-fecha_creacion')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class PedidoRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticatedAdminOrOwner]

    def patch(self, request, *args, **kwargs):
        pedido = self.get_object()
        if 'estado' in request.data:
            pedido.estado = request.data['estado']
            pedido.save()
            return Response(PedidoSerializer(pedido).data)
        return Response({'detail': 'Nada para actualizar.'}, status=status.HTTP_400_BAD_REQUEST)

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
