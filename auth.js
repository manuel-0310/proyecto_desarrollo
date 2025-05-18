console.log("auth.js cargado");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM listo");

    const registerForm = document.getElementById("register-form");
    if (!registerForm) {
        console.error("No se encontró el formulario de registro");
        return;
    }

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Formulario enviado");

        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        console.log("Datos capturados:", data);

        try {
            const response = await fetch("http://localhost:8000/api/register/", {
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
                const token = result.token;
                if (token) {
                    alert("Registro exitoso. Token: " + token);
                    // Opcional: redirigir
                    // window.location.href = "index.html";
                } else {
                    alert("Registro exitoso, pero sin token.");
                }
            } else {
                alert("Error: " + JSON.stringify(result));
            }

        } catch (error) {
            console.error("Error capturado:", error);
            alert("Error del servidor o conexión: " + error.message);
        }
    });
});

const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Login enviado");

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
        console.log("Datos login:", data);

        try {
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.token) {
                localStorage.setItem("token", result.token);
                alert("Inicio de sesión exitoso");
                window.location.href = "index.html";
            } else {
                alert("Error al iniciar sesión: " + JSON.stringify(result));
            }
        } catch (error) {
            console.error("Error capturado en login:", error);
            alert("Error en login: " + error.message);
        }
    });
}
