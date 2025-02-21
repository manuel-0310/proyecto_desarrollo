document.addEventListener("DOMContentLoaded", function() {
    let carrito = [];
    const listaCarrito = document.querySelector(".lista-carrito");
    const precioElemento = document.querySelector(".precio");
    const impuestoElemento = document.querySelector(".impuesto");
    const totalElemento = document.querySelector(".total");
    const taxSection = document.querySelector(".tax-section");

    // Evento para agregar productos al carrito
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function() {
            const nombreProducto = this.parentElement.querySelector("h3").textContent;
            const precioProducto = parseFloat(this.parentElement.querySelector(".price").textContent.replace("$", ""));

            // Verificar si el producto ya está en el carrito
            let productoExistente = carrito.find(item => item.nombre === nombreProducto);

            if (productoExistente) {
                productoExistente.cantidad++; // Aumentar la cantidad
            } else {
                carrito.unshift({ nombre: nombreProducto, precio: precioProducto, cantidad: 1 }); // Agregar nuevo producto
            }

            actualizarCarrito();
        });
    });

    // Evento para mostrar impuestos y total al hacer clic en "Procesar Compra"
    document.querySelector(".buy").addEventListener("click", function() {
        if (carrito.length > 0) {
            taxSection.classList.remove("hidden"); // Mostrar tax y total
            enviarPedido(); // Llamar a la función para actualizar la URL
        }
    });

    // Evento para limpiar el carrito al hacer clic en "Cancelar Compra"
    document.querySelector(".delate").addEventListener("click", function() {
        carrito = [];
        taxSection.classList.add("hidden"); // Ocultar tax y total nuevamente
        actualizarCarrito();
    });

    function actualizarCarrito() {
        listaCarrito.innerHTML = "";
        let precioTotal = 0;

        carrito.forEach(item => {
            let li = document.createElement("li");
            li.innerHTML = `<span class="nombre-producto">${item.nombre} ($${item.precio.toFixed(2)})</span>
                            <span class="cantidad">x${item.cantidad}</span>`;
            listaCarrito.appendChild(li);
            precioTotal += item.precio * item.cantidad;
        });

        let tax = (precioTotal * 0.035).toFixed(2); // Impuesto del 3.5%
        let total = (precioTotal + parseFloat(tax)).toFixed(2);

        precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
        impuestoElemento.textContent = `$${tax}`;
        totalElemento.textContent = `$${total}`;
    }

    function enviarPedido() {
        const params = new URLSearchParams();

        carrito.forEach((item, index) => {
            params.append(`producto${index}`, `${item.nombre}(${item.cantidad})`);
        });

        params.append("total", totalElemento.textContent);

        // Modifica la URL sin recargar la página
        window.history.pushState({}, "", `?${params.toString()}`);
    }
});
