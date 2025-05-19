// scriptmenu.js

// URL base de tu API de productos
const API_BASE_URL = "https://restaurante-piazzeta.onrender.com";

let carrito = [];

// Obtén referencias a los contenedores de cada categoría
const categoriasContenedores = {
  "Entradas": document.getElementById("menu-entradas"),
  "Pizzas":   document.getElementById("menu-Pizzas"),
  "Bebidas":  document.getElementById("menu-Bebidas"),
  "Postres":  document.getElementById("menu-Postres")
};

// Referencias del resumen de carrito
const listaCarrito    = document.querySelector(".lista-carrito");
const precioElemento  = document.querySelector(".precio");
const impuestoElemento= document.querySelector(".impuesto");
const totalElemento   = document.querySelector(".total");

// Carga el menú desde tu API y construye la UI
async function cargarMenu() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/menu-items/`);
    const items = await res.json();

    // Agrupa por categoría
    const porCategoria = items.reduce((acc, item) => {
      const cat = item.categoria || "Otros";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    // Para cada categoría, genera sus cards/botones
    Object.entries(porCategoria).forEach(([categoria, productos]) => {
      const contenedor = categoriasContenedores[categoria];
      if (!contenedor) return;
      contenedor.innerHTML = ""; // limpia antes
      productos.forEach(prod => {
        const card = document.createElement("div");
        card.className = "producto-card";
        card.innerHTML = `
          <img src="${prod.imagen}" alt="${prod.nombre}" class="prod-img"/>
          <h3>${prod.nombre}</h3>
          <p>${prod.descripcion}</p>
          <p class="precio-prod">$${parseFloat(prod.precio).toFixed(2)}</p>
          <button class="btn-agregar" data-id="${prod.id}"
                  data-nombre="${prod.nombre}"
                  data-precio="${prod.precio}">
            Añadir al carrito
          </button>
        `;
        contenedor.appendChild(card);
      });
    });

    // Agrega manejadores a todos los botones "Añadir al carrito"
    document.querySelectorAll(".btn-agregar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id     = btn.dataset.id;
        const nombre = btn.dataset.nombre;
        const precio = parseFloat(btn.dataset.precio);
        agregarAlCarrito({ id, nombre, precio, cantidad: 1 });
      });
    });

  } catch (err) {
    console.error("Error cargando menú:", err);
  }
}

// Agrega un item al carrito (o incrementa cantidad)
function agregarAlCarrito(item) {
  const existente = carrito.find(i => i.id === item.id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...item });
  }
  actualizarCarrito();
}

// Renderiza el carrito en pantalla y calcula totales
function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let precioTotal = 0;

  carrito.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="nombre-producto">${item.nombre}</span>
      <span class="cantidad">x${item.cantidad}</span>
      <span class="subtotal">\$${(item.precio * item.cantidad).toFixed(2)}</span>
      <button class="eliminar-item" data-index="${idx}">🗑️</button>
    `;
    listaCarrito.appendChild(li);
    precioTotal += item.precio * item.cantidad;
  });

  const tax   = precioTotal * 0.035;
  const total = precioTotal + tax;

  precioElemento.textContent    = `$${precioTotal.toFixed(2)}`;
  impuestoElemento.textContent  = `$${tax.toFixed(2)}`;
  totalElemento.textContent     = `$${total.toFixed(2)}`;

  // Guarda en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Buttons to remove items
  document.querySelectorAll(".eliminar-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index, 10);
      carrito.splice(idx, 1);
      actualizarCarrito();
    });
  });
}

// Carga carrito previo desde localStorage
function inicializarCarrito() {
  const saved = localStorage.getItem("carrito");
  if (saved) {
    carrito = JSON.parse(saved);
    actualizarCarrito();
  }
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  inicializarCarrito();
  cargarMenu();
});
