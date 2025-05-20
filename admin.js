const API_URL = "https://restaurante-piazzeta.onrender.com/api/pedidos/";
let pedidos = [];

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión.");
    window.location.href = "loginregister.html";
    return;
  }

  fetch(API_URL, {
    headers: {
      "Authorization": `Token ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      pedidos = data;
      mostrarPedidos(data);
    })
    .catch(err => {
      console.error("Error cargando pedidos:", err);
      alert("No se pudo obtener la lista de pedidos.");
    });
});

function mostrarPedidos(pedidosFiltrados) {
  const contenedor = document.getElementById("contenedor-pedidos");
  contenedor.innerHTML = "";

  if (pedidosFiltrados.length === 0) {
    contenedor.innerHTML = "<p>No hay pedidos que mostrar.</p>";
    return;
  }

  pedidosFiltrados.forEach(p => {
    const div = document.createElement("div");
    div.style = "background: rgba(255,255,255,0.1); margin-bottom:15px; padding:20px; border-radius:10px;";
    div.innerHTML = `
      <h3>Pedido #${p.id} - ${p.estado.toUpperCase()}</h3>
      <p><strong>Cliente:</strong> ${p.cliente}</p>
      <p><strong>Dirección:</strong> ${p.direccion || 'No disponible'}</p>
      <p><strong>Fecha:</strong> ${new Date(p.fecha_creacion).toLocaleString()}</p>
      <ul>
        ${p.items.map(item => `
          <li>${item.cantidad}× ${item.menu_item} — $${item.precio_unitario}</li>
        `).join('')}
      </ul>
      ${p.estado === "pendiente" ? `<button onclick="marcarAtendido(${p.id})" style="margin-top:10px; padding:10px; background:#ffd821; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">Marcar como Atendido</button>` : ""}
    `;
    contenedor.appendChild(div);
  });
}

function marcarAtendido(id) {
  const token = localStorage.getItem("token");
  fetch(`${API_URL}${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({ estado: "atendido" })
  })
    .then(res => res.json())
    .then(data => {
      alert("Pedido marcado como atendido");
      const index = pedidos.findIndex(p => p.id === id);
      pedidos[index].estado = "atendido";
      mostrarPedidos(pedidos);
    })
    .catch(err => {
      console.error("Error actualizando estado:", err);
      alert("No se pudo actualizar el pedido.");
    });
}

function filtrarPedidos() {
  const filtro = document.getElementById("filtro-cliente").value.toLowerCase();
  const filtrados = pedidos.filter(p => p.cliente.toLowerCase().includes(filtro));
  mostrarPedidos(filtrados);
}

function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "loginregister.html";
}
