document.addEventListener("DOMContentLoaded", function () {
    const cart = document.querySelector(".carritoCompra");
    const addCart = document.querySelectorAll(".add-to-cart");
    const buy = document.querySelector(".buy")
    const delate = document.querySelector(".delate");

    //BOTON AGREGAR AL CARRO DE COMPRAS
    addCart.forEach(button => {
        button.addEventListener("click", function () {
            const item = this.closest(".menu-item");
            const name = item.querySelector("h3").textContent;
            const price = parseFloat(item.querySelector(".price").textContent.replace("$", ""));
            const currentPrice = parseFloat(document.querySelector(".precio").textContent.replace("$", ""));
    
            let existingItem = Array.from(cart.children).find(cartItem => 
                cartItem.dataset.name === name
            );

            if (existingItem) {
                let countSpan = existingItem.querySelector(".count");
                let count = parseInt(countSpan.textContent.match(/\d+/)[0]) + 1;
                countSpan.textContent = `(${count})`;
            } else {
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.dataset.name = name; 
                cartItem.innerHTML = `<h4>${name} <span class="count">(1)</span></h4>`;
                cart.appendChild(cartItem);
            }
    
            const suma = currentPrice + price;
            const impuesto = parseFloat((suma * 0.035).toFixed(3));
            const total = parseFloat((suma + impuesto).toFixed(3));

            document.querySelector(".precio").textContent = `$${suma.toFixed(3)}`;
            document.querySelector(".impuesto").textContent = `$${impuesto}`;
            document.querySelector(".total").textContent = `$${total}`;
        });
    });

    //BOTON PARA COMPRAR
    buy.addEventListener("click", function (){
        
    });

    //BOTON CANCELAR COMPRA
    delate.addEventListener("click", function () {
        document.querySelector(".precio").textContent = `$0`;
        document.querySelector(".impuesto").textContent = `$0`;
        document.querySelector(".total").textContent = `$0`;
        const cartItems = cart.querySelectorAll(".cart-item");
        cartItems.forEach(item => item.remove());
    });
});
