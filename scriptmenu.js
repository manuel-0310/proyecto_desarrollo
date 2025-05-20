// scriptmenu.js

// URL base de tu API (producción o local)
const API_BASE_URL = "https://piazzeta-restaurante.onrender.com";

let carrito = [];

// Mapea nombre de categoría → contenedor en el DOM
const categoriasContenedores = {
  "Entradas": document.getElementById("menu-entradas"),
  "Pizzas":   document.getElementById("menu-Pizzas"),
  "Bebidas":  document.getElementById("menu-Bebidas"),
  "Postres":  document.getElementById("menu-Postres")
};

// Referencias del carrito
const listaCarrito    = document.querySelector(".lista-carrito");
const precioElemento  = document.querySelector(".precio");
const impuestoElemento= document.querySelector(".impuesto");
const totalElemento   = document.querySelector(".total");

// 1) Carga el menú desde /categories/
async function cargarMenu() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const categories = await res.json();

    categories.forEach(cat => {
      const cont = categoriasContenedores[cat.name];
      if (!cont) return;
      cont.innerHTML = "";

      cat.dishes.forEach(dish => {
        const card = document.createElement("div");
        card.className = "producto-card";
        card.innerHTML = `
          <img src="${dish.image_url}" alt="${dish.name}" class="prod-img"/>
          <h3>${dish.name}</h3>
          <p>${dish.description}</p>
          <p class="precio-prod">$${parseFloat(dish.price).toFixed(2)}</p>
          <button class="btn-agregar"
                  data-id="${dish.id}"
                  data-nombre="${dish.name}"
                  data-precio="${dish.price}">
            Añadir al carrito
          </button>
        `;
        cont.appendChild(card);
      });
    });

    // 2) Manejo de botones de añadir
    document.querySelectorAll(".btn-agregar").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = {
          id: btn.dataset.id,
          nombre: btn.dataset.nombre,
          precio: parseFloat(btn.dataset.precio),
          cantidad: 1
        };
        agregarAlCarrito(item);
      });
    });

  } catch (err) {
    console.error("Error cargando menú:", err);
    document.getElementById("menu-container").innerHTML =
      "<p>Error al cargar el menú. Intenta de nuevo más tarde.</p>";
  }
}

// [Aquí sigue tu lógica de carrito: agregarAlCarrito, actualizarCarrito, inicializarCarrito]

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  inicializarCarrito();
  cargarMenu();
});
