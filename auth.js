// auth.js

console.log("auth.js cargado");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM listo");

    // -------------------
    // Registro de usuario
    // -------------------
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Formulario de registro enviado");

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());
            console.log("Datos de registro:", data);

            try {
                const response = await fetch("https://TU-DOMINIO/api/register/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                const text = await response.text();
                let result;
                try {
                    result = JSON.parse(text);
                } catch {
                    throw new Error("Respuesta no válida del servidor: " + text);
                }

                if (response.ok) {
                    alert("Registro exitoso. Token: " + result.token);
                    // Opcional: guarda el token y redirige
                    localStorage.setItem("token", result.token);
                    window.location.href = "index.html";
                } else {
                    alert("Error en registro: " + JSON.stringify(result));
                }
            } catch (error) {
                console.error("Error en registro:", error);
                alert("Error de conexión: " + error.message);
            }
        });
    }

    // -------------------
    // Inicio de sesión
    // -------------------
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Formulario de login enviado");

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());
            console.log("Datos de login:", data);

            try {
                const response = await fetch("https://TU-DOMINIO/api/login/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok && result.token) {
                    localStorage.setItem("token", result.token);
                    alert("Inicio de sesión exitoso");
                    window.location.href = "menu.html"; // o la página principal
                } else {
                    alert("Error al iniciar sesión: " + JSON.stringify(result));
                }
            } catch (error) {
                console.error("Error en login:", error);
                alert("Error de conexión: " + error.message);
            }
        });
    }

    // -------------------
    // Crear un pedido
    // -------------------
    const orderForm = document.getElementById("order-form");
    if (orderForm) {
        orderForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Formulario de pedido enviado");

            // Ejemplo: tu form podría tener inputs tipo:
            // <input name="items" value='[{"menu_item":1,"cantidad":2,"precio_unitario":"9.99"}]' />
            const formData = new FormData(orderForm);
            const items = JSON.parse(formData.get("items")); 

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Debes iniciar sesión primero.");
                return;
            }

            try {
                const response = await fetch("https://TU-DOMINIO/api/pedidos/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`
                    },
                    body: JSON.stringify({ items })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Pedido creado con éxito. ID: " + result.id);
                    // Opcional: limpiar carrito, recargar la página, etc.
                } else {
                    alert("Error al crear pedido: " + JSON.stringify(result));
                }
            } catch (error) {
                console.error("Error al crear pedido:", error);
                alert("Error de conexión: " + error.message);
            }
        });
    }

    // -------------------
    // Listar mis pedidos
    // -------------------
    const loadOrdersBtn = document.getElementById("load-orders-btn");
    const ordersContainer = document.getElementById("orders-container");

    if (loadOrdersBtn && ordersContainer) {
        loadOrdersBtn.addEventListener("click", async () => {
            console.log("Cargando mis pedidos");

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Debes iniciar sesión primero.");
                return;
            }

            try {
                const response = await fetch("https://TU-DOMINIO/api/mis-pedidos/", {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });
                const pedidos = await response.json();

                if (response.ok) {
                    // Limpia contenedor
                    ordersContainer.innerHTML = "";
                    pedidos.forEach(pedido => {
                        const div = document.createElement("div");
                        div.classList.add("pedido");
                        div.innerHTML = `
                            <h4>Pedido #${pedido.id} (${pedido.estado})</h4>
                            <p>Fecha: ${new Date(pedido.fecha_creacion).toLocaleString()}</p>
                            <ul>
                                ${pedido.items.map(it => `
                                    <li>${it.cantidad}× Item ${it.menu_item} — $${it.precio_unitario}</li>
                                `).join('')}
                            </ul>
                        `;
                        ordersContainer.appendChild(div);
                    });
                } else {
                    alert("Error al obtener pedidos: " + JSON.stringify(pedidos));
                }
            } catch (error) {
                console.error("Error al cargar pedidos:", error);
                alert("Error de conexión: " + error.message);
            }
        });
    }
});
