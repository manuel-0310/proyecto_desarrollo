from django.contrib.auth.models import User
from rest_framework import serializers
from .models import MenuItem, Order, OrderItem
from .models import MenuItem
from rest_framework import serializers
from .models import Pedido, ItemPedido
from django.contrib.auth.models import User

class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPedido
        fields = ['menu_item', 'cantidad', 'precio_unitario']

class PedidoSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True)
    cliente = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'cliente', 'direccion', 'estado', 'fecha_creacion', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        pedido = Pedido.objects.create(**validated_data)
        for item_data in items_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)
        return pedido

    def update(self, instance, validated_data):
        instance.estado = validated_data.get('estado', instance.estado)
        instance.save()
        return instance

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'nombre', 'descripcion', 'precio', 'imagen', 'categoria']


# --- Serializer de Usuario (ya lo tienes) ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# --- Serializer de cada item en el pedido ---
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['menu_item', 'cantidad', 'precio_unitario']


# --- Serializer del pedido completo (incluye items) ---
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'fecha_creacion', 'estado', 'items']
        read_only_fields = ['id', 'fecha_creacion', 'estado']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        # El usuario lo asignamos desde la vista usando context
        order = Order.objects.create(usuario=self.context['request'].user)
        for item in items_data:
            OrderItem.objects.create(
                pedido=order,
                menu_item=item['menu_item'],
                cantidad=item['cantidad'],
                precio_unitario=item['precio_unitario']
            )
        return order
