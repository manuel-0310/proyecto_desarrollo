from django.db import models
from django.contrib.auth.models import User

# Si ya tienes un modelo MenuItem, omítelo; si no, crea uno así:
class MenuItem(models.Model):
    nombre       = models.CharField(max_length=100)
    descripcion  = models.TextField(blank=True)
    precio       = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.nombre

class Order(models.Model):
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('ENTREGADO', 'Entregado'),
    ]
    usuario         = models.ForeignKey(User, related_name='orders', on_delete=models.CASCADE)
    fecha_creacion  = models.DateTimeField(auto_now_add=True)
    estado          = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='PENDIENTE')

    def __str__(self):
        return f'Pedido #{self.id} – {self.usuario.username}'

class OrderItem(models.Model):
    pedido          = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item       = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    cantidad        = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f'{self.cantidad}×{self.menu_item.nombre} (pedido {self.pedido.id})'
