document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://api.sheetbest.com/sheets/88a8b6fd-221c-49ba-a9de-34b0c3300146";
    const categorias = {
        "Entradas": document.getElementById("menu-entradas"),
        "Pizzas": document.getElementById("menu-Pizzas"),
        "Bebidas": document.getElementById("menu-Bebidas"),
        "Postres": document.getElementById("menu-Postres")
    };

    let carrito = [];

    const listaCarrito = document.querySelector(".lista-carrito");
    const precioElemento = document.querySelector(".precio");
    const impuestoElemento = document.querySelector(".impuesto");
    const totalElemento = document.querySelector(".total");
    const taxSection = document.querySelector(".tax-section");

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            data.forEach(producto => {
                const card = document.createElement("section");
                card.className = "menu-item";

                const imagenUrl = producto.imagen?.trim() || "src/logo.png"; // imagen por defecto

                card.innerHTML = `
                    <div class="image-container">
                        <img src="${imagenUrl}" alt="${producto.nombre}">
                    </div>
                    <h3>${producto.nombre}</h3>
                    <p class="description">${producto.descripcion}</p>
                    <p class="price">$${producto.precio}</p>
                    <button class="add-to-cart" data-nombre="${producto.nombre}" data-precio="${producto.precio}">+</button>
                `;

                if (categorias[producto.categoria]) {
                    categorias[producto.categoria].appendChild(card);
                }
            });

            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", () => {
                    const nombreProducto = button.dataset.nombre;
                    const precioProducto = parseFloat(button.dataset.precio);

                    let productoExistente = carrito.find(item => item.nombre === nombreProducto);

                    if (productoExistente) {
                        productoExistente.cantidad++;
                    } else {
                        carrito.unshift({ nombre: nombreProducto, precio: precioProducto, cantidad: 1 });
                    }

                    actualizarCarrito();
                });
            });
        })
        .catch(err => console.error("Error cargando productos:", err));

    document.querySelector(".buy").addEventListener("click", () => {
        if (carrito.length > 0) {
            taxSection.classList.remove("hidden");
            enviarPedido();
        }
    });

    document.querySelector(".delate").addEventListener("click", () => {
        carrito = [];
        taxSection.classList.add("hidden");
        actualizarCarrito();
    });

    function actualizarCarrito() {
        listaCarrito.innerHTML = "";
        let precioTotal = 0;

        carrito.forEach((item, index) => {
            let li = document.createElement("li");
            li.innerHTML = `<span class="nombre-producto">${item.nombre} ($${item.precio.toFixed(2)})</span>
                            <span class="cantidad">x${item.cantidad}</span>
                            <button class="eliminar-item" data-index="${index}">🗑️</button>`;
            listaCarrito.appendChild(li);
            precioTotal += item.precio * item.cantidad;
        });

        let tax = (precioTotal * 0.035).toFixed(2);
        let total = (precioTotal + parseFloat(tax)).toFixed(2);

        precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
        impuestoElemento.textContent = `$${tax}`;
        totalElemento.textContent = `$${total}`;

        document.querySelectorAll(".eliminar-item").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                carrito.splice(index, 1);
                actualizarCarrito();
            });
        });
    }

    function enviarPedido() {
        const params = new URLSearchParams();
        carrito.forEach((item, index) => {
            params.append(`producto${index}`, `${item.nombre}(${item.cantidad})`);
        });
        params.append("total", totalElemento.textContent);
        window.history.pushState({}, "", `?${params.toString()}`);
    }
});

