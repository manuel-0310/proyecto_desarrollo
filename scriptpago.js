document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let listaCarrito = document.getElementById("lista-carrito");
    let precioElemento = document.getElementById("precio");
    let impuestoElemento = document.getElementById("impuesto");
    let totalElemento = document.getElementById("total");

    let subtotal = 0;
    listaCarrito.innerHTML = ""; // Limpiar la lista antes de agregar elementos

    carrito.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `* ${item.nombre} (${item.cantidad}) . . . . . . . . ${item.precio}$`;
        listaCarrito.appendChild(li);
        subtotal += item.precio * item.cantidad;
    });

    let impuesto = (subtotal * 0.035).toFixed(2);
    let total = (subtotal + parseFloat(impuesto)).toFixed(2);

    precioElemento.textContent = `$${subtotal.toFixed(2)}`;
    impuestoElemento.textContent = `$${impuesto}`;
    totalElemento.textContent = `$${total}`;
});

function submitForm() {
    let nombre = document.getElementById("nombre").value;
    let telefono = document.getElementById("telefono").value;
    let direccion = document.getElementById("direccion").value;
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let fecha = new Date().toLocaleString();

    if (!nombre || !telefono || !direccion || carrito.length === 0) {
        alert("Por favor completa todos los campos y agrega productos al carrito.");
        return;
    }

    let productosString = carrito.map(item => `${item.nombre} (${item.cantidad}) - ${item.precio}$`).join("; ");

    const pedido = {
        Fecha: fecha,
        Cliente: nombre,
        Teléfono: telefono,
        Dirección: direccion,
        Productos: productosString,
        Total: document.getElementById("total").textContent
    };
    
    fetch("https://api.sheetbest.com/sheets/bf54fd4d-c232-40fa-8d4d-06bd89e9a3d3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
        
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta:", data);
        alert("Pedido enviado con éxito.");
        localStorage.removeItem("carrito"); // Limpia el carrito después del envío
        window.location.href = "menu.html"; // Redirige a una página de confirmación
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al enviar el pedido.");
    });
}
