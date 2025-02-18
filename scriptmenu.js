document.addEventListener("DOMContentLoaded", function () {
    const cart = document.querySelector(".carritoCompra");
    const buttons = document.querySelectorAll(".add-to-cart");
    const delate = document.querySelector(".delate");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const item = this.closest(".menu-item");
            const name = item.querySelector("h3").textContent;
            const price = parseFloat(item.querySelector(".price").textContent.replace("$", ""));
            const currentPrice = parseFloat(document.querySelector(".precio").textContent.replace("$", ""));
    
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `<h4>${name}</h4>`;
            cart.appendChild(cartItem);
    
            const suma = currentPrice + price;
            document.querySelector(".precio").textContent = `$${suma}`; // Corrige el selector
        });
    });
    

    delate.addEventListener("click", function () {
        document.querySelector(".precio").textContent = `$0`;
        const cartItems = cart.querySelectorAll(".cart-item");
        cartItems.forEach(item => item.remove());
    });
});
