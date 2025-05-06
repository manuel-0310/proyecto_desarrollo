from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view

@api_view(['GET'])
def authors(request):
    return Response([
        {'nombre': 'Daniel Riveros', 'código': 'Código1'},
        {'nombre': 'Manuel Castillo', 'código': '320256'},
        # Agrega aquí todos los integrantes de tu equipo
    ])


from .serializers import UserSerializer

class RegisterView(APIView):
    # Cualquiera puede crear cuenta
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # Si los datos son válidos, crea el usuario
        user = serializer.save()
        # Genera y devuelve el token
        token = Token.objects.create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        user = authenticate(
            username=request.data.get('username'),
            password=request.data.get('password')
        )
        if not user:
            return Response({'error': 'Credenciales inválidas'}, status=400)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication] 

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
