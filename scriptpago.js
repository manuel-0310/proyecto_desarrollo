// scriptpago.js

// URL base de tu API desplegada en Render
const API_BASE_URL = "https://restaurante-piazzeta.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    // Carga el carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const listaCarrito   = document.getElementById("lista-carrito");
    const precioElemento = document.getElementById("precio");
    const impuestoElemento = document.getElementById("impuesto");
    const totalElemento    = document.getElementById("total");

    // Calcula y muestra el resumen del carrito
    let subtotal = 0;
    listaCarrito.innerHTML = "";

    carrito.forEach(item => {
        const precio   = parseFloat(item.precio)   || 0;
        const cantidad = parseInt(item.cantidad)    || 0;
        const li       = document.createElement("li");
        li.textContent = `* ${item.nombre} (x${cantidad}) – $${precio.toFixed(2)}`;
        listaCarrito.appendChild(li);
        subtotal += precio * cantidad;
    });

    const impuesto = subtotal * 0.035;
    const total    = subtotal + impuesto;

    precioElemento.textContent    = `$${subtotal.toFixed(2)}`;
    impuestoElemento.textContent  = `$${impuesto.toFixed(2)}`;
    totalElemento.textContent     = `$${total.toFixed(2)}`;
});

// Función para cancelar el pedido y volver al menú
function cancelarPedido() {
    window.location.href = "menu.html";
}

// Envío del formulario de pedido a la API
const pedidoForm = document.getElementById("pedido-form");
if (pedidoForm) {
    pedidoForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        // Validación de datos de envío
        const nombre    = document.getElementById("nombre").value.trim();
        const telefono  = document.getElementById("telefono").value.trim();
        const direccion = document.getElementById("direccion").value.trim();

        if (!/^\d+$/.test(telefono)) {
            alert("El número de teléfono solo debe contener dígitos.");
            return;
        }
        if (!nombre || !telefono || !direccion) {
            alert("Por favor completa todos los campos.");
            return;
        }

        // Comprueba que el usuario esté autenticado
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión para hacer un pedido.");
            window.location.href = "login.html";
            return;
        }

        // Prepara los items para la API
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const items = carrito.map(item => ({
            menu_item:       item.id,
            cantidad:        parseInt(item.cantidad, 10) || 1,
            precio_unitario: parseFloat(item.precio)     || 0
        }));

        try {
            const response = await fetch(`${API_BASE_URL}/api/pedidos/`, {
                method: "POST",
                headers: {
                    "Content-Type":  "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({ items })
            });

            const result = await response.json();

            if (response.ok) {
                alert(`¡Pedido creado con éxito! ID: ${result.id}`);
                localStorage.removeItem("carrito");
                window.location.href = "menu.html";
            } else {
                console.error("Error al crear pedido:", result);
                alert("Error al crear pedido: " + (result.detail || JSON.stringify(result)));
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar con el servidor.");
        }
    });
}
