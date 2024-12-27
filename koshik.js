// Function to get saved products from cookies
function getSavedProducts() {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        if (key === "products") {
            try {
                return JSON.parse(decodeURIComponent(value));
            } catch {
                return [];
            }
        }
        return acc;
    }, []);
    return cookies || [];
}

// Function to render the saved products in the cart
function renderCartItems() {
    const cartContainer = document.querySelector("main");
    const savedProducts = getSavedProducts();
    const pointer = document.querySelector('.resultCART');  

    // if (savedProducts.length === 0) {
    //     cartContainer.innerHTML += `<p class="text24" style="margin-left: 10px;">Ваш кошик порожній.</p>`;
    //     return;
    // }

    let totalSum = 0;

    savedProducts.forEach((product) => {
        totalSum += parseFloat(product.price) * product.quantity;
        const itemHTML = `
            <div class="carditems d-flex align-items-center justify-content-between">
                <p class="text36" style="margin-left: 10px;">${product.name}</p>
                <div>
                    <p class="text24">Кількість:</p>
                    <input class="quantity" type="number" min="1" value="${product.quantity}" data-name="${product.name}">
                </div>
                <p class="text24" style="margin-right: 10px;">${product.price} грн</p>
            </div>
        `;
        pointer.insertAdjacentHTML("afterend", itemHTML);
    });

    // cartContainer.insertAdjacentHTML(
    //     "beforeend",
    //     `<p class="text20" style="margin: 20px; margin-bottom: 20px;">Сума замовлення: ${totalSum.toFixed(2)} грн.</p>`
    // );

    attachQuantityChangeHandlers();
}

// Function to update cookies when quantity changes
function attachQuantityChangeHandlers() {
    const quantityInputs = document.querySelectorAll(".quantity");

    quantityInputs.forEach((input) => {
        input.addEventListener("change", () => {
            const productName = input.dataset.name;
            const newQuantity = parseInt(input.value);

            const savedProducts = getSavedProducts();
            const product = savedProducts.find((item) => item.name === productName);

            if (product) {
                product.quantity = newQuantity;
                const date = new Date();
                date.setTime(date.getTime() + 24 * 60 * 60 * 1000); // 1 day expiration
                const expires = "; expires=" + date.toUTCString();
                document.cookie = `products=${encodeURIComponent(
                    JSON.stringify(savedProducts)
                )}${expires}; path=/`;
            }

            // Recalculate the total sum
            const totalSum = savedProducts.reduce(
                (sum, item) => sum + parseFloat(item.price) * item.quantity,
                0
            );
            document.querySelector(".text20").innerText = `Сума замовлення: ${totalSum.toFixed(2)} грн.`;
        });
    });
}

// Load and display products in the cart on page load
window.addEventListener("load", () => {
    renderCartItems();
});
