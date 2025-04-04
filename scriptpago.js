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

    const pedido = {
        nombre: document.getElementById("nombre").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        productos: carrito.map(item => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio // Asegura que el precio se envía
        }))
    };
    
    fetch("https://script.google.com/macros/s/AKfycbz0-KJ6gf6haInJzPdfdkO-inFGvOtzbgjaYuHdl9OA16W4MiUP-GPZ2I2EpNN1cJuVfw/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre: "Prueba Manual",
            telefono: "123456789",
            direccion: "Calle Falsa 123",
            productos: [{ nombre: "Pizza", precio: 10, cantidad: 2 }]
        })
    })
    .then(response => response.text())
    .then(data => console.log("Respuesta:", data))
    .catch(error => console.error("Error:", error));

    alert("Pedido enviado con éxito.");
    localStorage.removeItem("carrito"); // Limpia el carrito después del envío
    window.location.href = "menu.html"; // Redirige a una página de confirmación
}

