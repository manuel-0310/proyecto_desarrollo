// Espera a que el contenido del DOM se cargue completamente antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function() { 
    // Inicializamos un array vacío para almacenar los productos en el carrito
    let carrito = [];

    // Seleccionamos los elementos del DOM relacionados con el carrito
    const listaCarrito = document.querySelector(".lista-carrito"); // Lista donde se mostrarán los productos
    const precioElemento = document.querySelector(".precio"); // Elemento donde se muestra el precio total
    const impuestoElemento = document.querySelector(".impuesto"); // Elemento donde se muestra el impuesto
    const totalElemento = document.querySelector(".total"); // Elemento donde se muestra el total a pagar
    const taxSection = document.querySelector(".tax-section"); // Sección donde se muestran los impuestos y el total

    // Agrega un evento a cada botón "Agregar al carrito"
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function() {
            // Obtener el nombre del producto desde el elemento h3 dentro del contenedor del botón
            const nombreProducto = this.parentElement.querySelector("h3").textContent;
            // Obtener el precio del producto, eliminando el signo "$" y convirtiéndolo en número
            const precioProducto = parseFloat(this.parentElement.querySelector(".price").textContent.replace("$", ""));

            // Verificar si el producto ya está en el carrito
            let productoExistente = carrito.find(item => item.nombre === nombreProducto);

            if (productoExistente) {
                productoExistente.cantidad++; // Si ya está en el carrito, aumentar la cantidad
            } else {
                // Si no está en el carrito, agregarlo al inicio del array con cantidad 1
                carrito.unshift({ nombre: nombreProducto, precio: precioProducto, cantidad: 1 });
            }

            // Actualizar la vista del carrito después de agregar el producto
            actualizarCarrito();
        });
    });

    // Evento para mostrar impuestos y total al hacer clic en "Procesar Compra"
    document.querySelector(".buy").addEventListener("click", function() {
        if (carrito.length > 0) { // Solo se procesa la compra si hay productos en el carrito
            taxSection.classList.remove("hidden"); // Mostrar la sección de impuestos y total
            enviarPedido(); // Llamar a la función que actualiza la URL con los datos del pedido
        }
    });

    // Evento para limpiar el carrito al hacer clic en "Cancelar Compra"
    document.querySelector(".delate").addEventListener("click", function() {
        carrito = []; // Vaciar el array del carrito
        taxSection.classList.add("hidden"); // Ocultar la sección de impuestos y total
        actualizarCarrito(); // Refrescar la vista del carrito (se verá vacío)
    });

    // Función para actualizar la lista del carrito y los precios
    function actualizarCarrito() {
        listaCarrito.innerHTML = ""; // Vaciar la lista del carrito antes de actualizar
        let precioTotal = 0; // Variable para almacenar el precio total

        // Recorrer los productos en el carrito y agregarlos a la lista
        carrito.forEach((item, index) => {
            let li = document.createElement("li"); // Crear un nuevo elemento <li> para cada producto
            li.innerHTML = `<span class="nombre-producto">${item.nombre} ($${item.precio.toFixed(2)})</span>
                            <span class="cantidad">x${item.cantidad}</span>
                            <button class="eliminar-item" data-index="${index}">
                                🗑️
                            </button>`;

            listaCarrito.appendChild(li); // Agregar el elemento a la lista del carrito
            precioTotal += item.precio * item.cantidad; // Sumar el precio del producto al total
        });

        // Calcular el impuesto del 3.5% sobre el precio total
        let tax = (precioTotal * 0.035).toFixed(2);
        let total = (precioTotal + parseFloat(tax)).toFixed(2); // Calcular el total sumando impuestos

        // Actualizar los valores en la interfaz
        precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
        impuestoElemento.textContent = `$${tax}`;
        totalElemento.textContent = `$${total}`;

        // Agregar eventos a los botones de eliminar dentro del carrito
        document.querySelectorAll(".eliminar-item").forEach(button => {
            button.addEventListener("click", function() {
                let index = this.getAttribute("data-index"); // Obtener el índice del producto
                carrito.splice(index, 1); // Eliminar el producto del array
                actualizarCarrito(); // Refrescar la vista del carrito
            });
        });
    }

    // Función para actualizar la URL con los datos del pedido sin recargar la página
    function enviarPedido() {
        const params = new URLSearchParams(); // Crear un objeto para almacenar los parámetros

        // Recorrer el carrito y agregar cada producto como parámetro en la URL
        carrito.forEach((item, index) => {
            params.append(`producto${index}`, `${item.nombre}(${item.cantidad})`);
        });

        params.append("total", totalElemento.textContent); // Agregar el total de la compra a la URL

        // Modificar la URL en la barra de direcciones sin recargar la página
        window.history.pushState({}, "", `?${params.toString()}`);
    }
});
