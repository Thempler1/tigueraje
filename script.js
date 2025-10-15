const products = [
    {
        id: 1,
        title: "Gomitas sabor Walu",
        price: 2990,
        discount: 0.0,
        image: "gomitas-walu.png",
        stock: 0
    },
    {
        id: 2,
        title: "Gomitas Tigueraje",
        price: 2990,
        discount: 0.0,
        image: "gomitas-tigueraje.png",
        stock: 0
    },
    {
        id: 4,
        title: "Próximamente Entradas para : \"Los tigueres lloran, sienten y mienten\"",
        price: 12500,
        discount: 0.2,
        image: "walu-concert.png",
        stock: 0
    }
];

const cart = [];

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    products.forEach(product => {
        const discountedPrice = Math.round(product.price * (1 - product.discount));
        const discountPercent = Math.round(product.discount * 100);
        // Formatear precios con punto como separador de miles
        const formatCLP = n => n.toLocaleString('es-CL');
        const div = document.createElement('div');
        div.className = 'product';
        let stockHtml = '';
        let buttonHtml = '';
        let pricesHtml = '';
        let imgClass = '';
        if (product.price === 0) {
            pricesHtml = '';
        } else if (discountPercent > 0) {
            pricesHtml = `
                <span class="original-price">$${formatCLP(product.price)}</span>
                <span class="discounted-price">$${formatCLP(discountedPrice)}</span>
                <span class="discount-percent">-${discountPercent}%</span>
            `;
        } else {
            pricesHtml = `<span class="discounted-price">$${formatCLP(product.price)}</span>`;
        }
        if (product.price === 0) {
            stockHtml = '';
            buttonHtml = '<button class="add-to-cart" data-id="' + product.id + '" disabled>Próximamente</button>';
            imgClass = 'out-of-stock-img';
        } else if (product.stock === 0) {
            stockHtml = '<div class="out-of-stock">Sin stock</div>';
            buttonHtml = '<button class="add-to-cart" data-id="' + product.id + '" disabled>Agregar al carrito</button>';
        } else {
            buttonHtml = '<button class="add-to-cart" data-id="' + product.id + '">Agregar al carrito</button>';
        }
        div.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="${imgClass}">
            <div class="product-title">${product.title}</div>
            <div class="product-prices">
                ${pricesHtml}
            </div>
            ${stockHtml}
            ${buttonHtml}
        `;
        list.appendChild(div);
    });
}

function updateCartCount() {
    // Suma todas las cantidades de productos en el carrito
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = totalQty;
}

function showCart() {
    document.getElementById('cart-modal').style.display = 'flex';
    renderCartItems();
}

function hideCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function renderCartItems() {
    const items = document.getElementById('cart-items');
    items.innerHTML = '';
    let total = 0;
    // Formatear precios con punto como separador de miles
    const formatCLP = n => n.toLocaleString('es-CL');
    cart.forEach(item => {
        const discountedPrice = Math.round(item.price * (1 - item.discount));
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.title} x${item.qty} - $${formatCLP(discountedPrice * item.qty)}
            <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
        `;
        items.appendChild(li);
        total += discountedPrice * item.qty;
    });
    document.getElementById('cart-total').textContent = formatCLP(total);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartCount();
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();

    document.getElementById('product-list').addEventListener('click', e => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToCart(id);
            renderCartItems(); // Actualiza el carrito en tiempo real
        }
    });

    document.getElementById('cart-btn').addEventListener('click', e => {
        e.preventDefault();
        showCart();
    });
    document.getElementById('close-cart').addEventListener('click', hideCart);

    document.getElementById('cart-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('cart-modal')) {
            hideCart();
        }
    });

    // Eliminar productos del carrito
    document.getElementById('cart-items').addEventListener('click', e => {
        if (e.target.classList.contains('remove-from-cart')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const idx = cart.findIndex(i => i.id === id);
            if (idx !== -1) {
                if (cart[idx].qty > 1) {
                    cart[idx].qty--;
                } else {
                    cart.splice(idx, 1);
                }
                updateCartCount();
                renderCartItems();
            }
        }
    });

    // Botón de checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío. Agrega productos antes de continuar.');
        } else {
            window.location.href = 'https://www.ecopass.cl/';
        }
    });

    // Trivia
    const triviaQuestions = [
        {
            question: "¿Los tigueres lloran?",
            options: ["Sí", "No"]
        },
        {
            question: "¿Sienten?",
            options: ["Sí", "No"]
        },
        {
            question: "¿Y mienten?",
            options: ["Sí", "No"]
        }
    ];
    let triviaIndex = 0;
    const triviaContainer = document.getElementById('trivia-container');

    function showTriviaQuestion(index) {
        if (index < triviaQuestions.length) {
            const q = triviaQuestions[index];
            triviaContainer.innerHTML = `
                <div class="trivia-question">
                    <p>${q.question}</p>
                    <div class="trivia-options">
                        <button class="trivia-btn" data-answer="${q.options[0]}">${q.options[0]}</button>
                        <button class="trivia-btn" data-answer="${q.options[1]}">${q.options[1]}</button>
                    </div>
                </div>
            `;
        } else {
            // Poll de 12 respuestas enumeradas
            const pollAnswers = [
                "1. YOHJII",
                "2. nadiecomotuuU",
                "3. la bahiiia ft nvizo & sando",
                "4. NVC",
                "5. lo que hubieramos sido",
                "6. a todos lados! ft. white & stampida",
                "7. tigueraje",
                "8. malamemoria",
                "9. q fue d tu gato",
                "10. hacerloOoOo ʚ(｡˃ ᵕ ˂ )ɞ ft stampida",
                "11. aaazotarle",
                "12. aterrizaje d emergencia"
            ];
            const randomIndex = Math.floor(Math.random() * pollAnswers.length);
            triviaContainer.innerHTML = `<div class=\"trivia-end\"><div style=\"margin-bottom:0.7rem;font-weight:800;color:#f5a946ff;\">Tu canción será</div>${pollAnswers[randomIndex]}</div>`;
        }
    }

    showTriviaQuestion(triviaIndex);

    triviaContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('trivia-btn')) {
            triviaIndex++;
            showTriviaQuestion(triviaIndex);
        }
    });

    document.querySelector('.nav-links a[href="#home"]').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
