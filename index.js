// Функція для отримання даних про товар
function getProductInfo(button) {
    const container = button.closest(".items"); // Знаходимо батьківський контейнер
    const name = container.querySelector("p.text24").innerText; // Назва товару
    const description = container.querySelector("p:nth-of-type(2)").innerText; // Опис
    const price = container.querySelector("p:nth-of-type(3)").innerText; // Ціна
    const image = container.querySelector("img").src; // URL зображення
    return { name, description, price, image, quantity: 1 }; // Додаємо кількість
}

// Функція для отримання існуючих товарів із cookies
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

// Функція для збереження товарів у cookies
function saveToCookies(newProduct) {
    const existingProducts = getSavedProducts(); // Отримуємо існуючі товари

    // Перевіряємо, чи вже є такий товар в списку
    const existingProductIndex = existingProducts.findIndex(product => product.name === newProduct.name && product.price === newProduct.price);

    if (existingProductIndex !== -1) {
        // Якщо товар вже є, збільшуємо кількість
        existingProducts[existingProductIndex].quantity += 1;
    } else {
        // Якщо товару немає, додаємо його до списку
        existingProducts.push(newProduct);
    }

    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000)); // Термін дії cookies: 1 день
    const expires = "; expires=" + date.toUTCString();
    document.cookie = `products=${encodeURIComponent(JSON.stringify(existingProducts))}${expires}; path=/`;
}

// Обробник кліку для кнопок "Купити"
document.querySelectorAll(".itembuy").forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault(); // Скасовуємо стандартну дію кнопки (якщо це посилання)
        const productInfo = getProductInfo(button); // Отримуємо інформацію про товар
        saveToCookies(productInfo); // Зберігаємо у cookie
        console.log("Товар додано до cookies:", productInfo);
        console.log("Усі збережені товари:", getSavedProducts());
    });
});

// Вивід усіх товарів із cookies при завантаженні сторінки
window.addEventListener("load", () => {
    const savedProducts = getSavedProducts();
    console.log("Збережені товари при завантаженні сторінки:", savedProducts);
    
    // Перебираємо всі елементи
    savedProducts.forEach(function(product) {
        // console.log(`Назва товару: ${product.name}, Ціна: ${product.price}, Кількість: ${product.quantity}`);
        console.log(product.name)
        // Тут можна додати код для відображення товарів на сторінці
        // Наприклад, додати їх до кошика на сторінці
    });
});

