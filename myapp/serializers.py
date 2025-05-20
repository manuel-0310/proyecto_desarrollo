from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Category, Dish, Pedido, ItemPedido


# --- Menú ---
class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'image_url']


class CategorySerializer(serializers.ModelSerializer):
    dishes = DishSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'dishes']


# --- Pedidos ---
class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPedido
        fields = ['plato', 'cantidad', 'precio_unitario']


class PedidoSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(read_only=True)
    items = ItemPedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'direccion', 'estado', 'fecha_creacion', 'total', 'items']
        read_only_fields = ['usuario', 'fecha_creacion', 'total']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        # Asigna el usuario desde la vista (request.user)
        pedido = Pedido.objects.create(**validated_data, usuario=self.context['request'].user)
        total = 0
        for item in items_data:
            obj = ItemPedido.objects.create(
                pedido=pedido,
                plato=item['plato'],
                cantidad=item['cantidad'],
                precio_unitario=item['precio_unitario']
            )
            total += obj.cantidad * obj.precio_unitario
        pedido.total = total
        pedido.save()
        return pedido


# --- Usuarios ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
