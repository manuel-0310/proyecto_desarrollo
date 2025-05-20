from django.db import models
from django.conf import settings
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Dish(models.Model):
    category    = models.ForeignKey(Category, related_name='dishes', on_delete=models.CASCADE)
    name        = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=8, decimal_places=2)
    image_url   = models.URLField(blank=True)
    def __str__(self):
        return f"{self.name} ({self.category.name})"

class Pedido(models.Model):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('atendido',  'Atendido'),
    )
    usuario        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    direccion      = models.CharField(max_length=255, blank=True)
    estado         = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha_creacion = models.DateTimeField(default=timezone.now)
    total          = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    def __str__(self):
        return f"Pedido {self.id} — {self.usuario.username}"

class ItemPedido(models.Model):
    pedido          = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    plato           = models.ForeignKey(Dish, on_delete=models.CASCADE)
    cantidad        = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=8, decimal_places=2)
    def __str__(self):
        return f"{self.cantidad}×{self.plato.name}"
