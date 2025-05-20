#!/usr/bin/env python
import os
import django

# 1. Dile a Django dónde encontrar settings.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
# 2. Inicializa Django
django.setup()

import csv
from myapp.models import Category, Dish

with open('Menu - Hoja 1.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        cat, _ = Category.objects.get_or_create(name=row['categoria'])
        Dish.objects.create(
            category=cat,
            name=row['nombre'],
            description=row['descripcion'],
            price=row['precio'],
            image_url=row['imagen']
        )

print("¡Datos de menú importados!")
