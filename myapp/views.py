# myapp/views.py

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Dish, Pedido, ItemPedido
from .serializers import (
    UserSerializer,
    CategorySerializer,
    DishSerializer,
    PedidoSerializer,
)


# ————— Menú —————

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


# ————— Autenticación —————

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

    def post(self, request):
        user = authenticate(
            username=request.data.get('username'),
            password=request.data.get('password')
        )
        if not user:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})


class ProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# ————— Pedidos —————

class PedidoListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        # Necesario para que en Serializer.create() podamos usar `self.context['request'].user`
        return {'request': self.request}

    def get_queryset(self):
        qs = Pedido.objects.all()
        user = self.request.user
        if not user.is_staff:
            qs = qs.filter(usuario=user)
        estado = self.request.query_params.get('estado')
        cliente = self.request.query_params.get('cliente')
        if estado:
            qs = qs.filter(estado=estado)
        if cliente:
            qs = qs.filter(usuario__username__icontains=cliente)
        return qs.order_by('-fecha_creacion')

    def perform_create(self, serializer):
        # El serializer ya sabe quién es request.user gracias al contexto
        serializer.save()


class PedidoRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Pedido.objects.all().order_by('-fecha_creacion')
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        pedido = self.get_object()
        nuevo_estado = request.data.get('estado')
        if nuevo_estado:
            pedido.estado = nuevo_estado
            pedido.save()
            return Response(PedidoSerializer(pedido).data)
        return Response({'detail': 'Nada para actualizar.'}, status=status.HTTP_400_BAD_REQUEST)
