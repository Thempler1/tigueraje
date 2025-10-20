const products = [
    {
        id: 1,
        title: "Entradas próximo show",
        price: 12500,
        discount: 0.2,
        image: "walu-concert.png",
        stock: false,
        proximamente: true
    },
    {
        id: 2,
        title: "Gomitas sabor Walu",
        price: 2990,
        discount: 0.0,
        image: "gomitas-walu.png",
        stock: false,
        proximamente: false
    },
    {
        id: 3,
        title: "Gomitas Tigueraje",
        price: 2990,
        discount: 0.0,
        image: "gomitas-tigueraje.png",
        stock: false,
        proximamente: false
    },

];

const cart = [];

// Variables globales para navegación
let productosBtn, productosSection, inicioSection, inicioBtn;

// ===== FUNCIONES DE PRODUCTOS Y CARRITO =====

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
        if (product.proximamente) {
            pricesHtml = '<span class="discounted-price">$???</span>';
            stockHtml = '';
            buttonHtml = '<button class="add-to-cart" data-id="' + product.id + '" disabled>Próximamente</button>';
            imgClass = 'out-of-stock-img';
        } else if (product.price === 0) {
            pricesHtml = '';
            stockHtml = '';
            buttonHtml = '<button class="add-to-cart" data-id="' + product.id + '" disabled>Próximamente</button>';
            imgClass = 'out-of-stock-img';
        } else if (discountPercent > 0) {
            pricesHtml = `
                <span class="original-price">$${formatCLP(product.price)}</span>
                <span class="discounted-price">$${formatCLP(discountedPrice)}</span>
                <span class="discount-percent">-${discountPercent}%</span>
            `;
        } else {
            pricesHtml = `<span class="discounted-price">$${formatCLP(product.price)}</span>`;
        }
        if (product.proximamente || product.price === 0) {
            // ya está manejado arriba
        } else if (!product.stock) {
            stockHtml = '<div class="out-of-stock">Sin stock</div>';
            buttonHtml = '<button class="add-to-cart" data-id="' + product.id + '" disabled>Agregar al carrito</button>';
        } else {
            buttonHtml = '<button class="add-to-cart" data-id="' + product.id + '">Agregar al carrito</button>';
        }
        div.innerHTML = `
            <div style="position: relative; display: inline-block;">
                <img src="${product.image}" alt="${product.title}" class="${imgClass}">
                ${product.proximamente ? '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: #ff9800; padding: 0.5rem 1rem; border-radius: 8px; font-weight: bold; font-size: 0.9rem; text-align: center; z-index: 10;">PRÓXIMAMENTE</div>' : ''}
            </div>
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

// ===== FUNCIONES DE NAVEGACIÓN =====

// Función optimizada para refrescar los embeds de Instagram
function refreshInstagramEmbeds() {
    if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
    }
    
    // Optimización: solo buscar embeds si están visibles
    if (!inicioSection.classList.contains('section-hidden')) {
        const instagramEmbeds = document.querySelectorAll('.instagram-media');
        instagramEmbeds.forEach(embed => {
            embed.style.display = 'none';
            embed.offsetHeight; // Trigger reflow
            embed.style.display = '';
        });
    }
}

// Función para cambiar secciones de manera optimizada
function switchSection(showSection, hideSection) {
    hideSection.classList.add('section-hidden');
    showSection.classList.remove('section-hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== FUNCIONES DE TRIVIA =====

function initTrivia() {
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
            // Ocultar el párrafo de introducción
            const triviaIntro = document.getElementById('trivia-intro');
            if (triviaIntro) {
                triviaIntro.style.display = 'none';
            }
            // Poll de 12 respuestas enumeradas
            const pollAnswers = [
                "1. YOHJII",
                "2. nadiecomotu",
                "3. la bahiiia ft nvizo & sando",
                "4. nvc",
                "5. lo que hubieramos sido",
                "6. a todos lados! ft. White & Stampida",
                "7. tigueraje",
                "8. malamemoria",
                "9. hacerloOoOo ʚ(｡˃ ᵕ ˂ )ɞ ft Stampida",
                "10. aaazotarle",
                "11. aterrizaje d emergencia"
            ];
            const randomIndex = Math.floor(Math.random() * pollAnswers.length);
            const triviaEndDiv = document.createElement('div');
            triviaEndDiv.className = 'trivia-end fade-in';
            triviaEndDiv.innerHTML = `<div style="margin-bottom:0.7rem;font-weight:800;color:#f5a946ff;">Tu canción será</div><div style="font-size:1.1rem;color:#f5a946ff;">${pollAnswers[randomIndex]}</div>`;
            triviaContainer.innerHTML = '';
            triviaContainer.appendChild(triviaEndDiv);
        }
    }

    showTriviaQuestion(triviaIndex);

    triviaContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('trivia-btn')) {
            triviaIndex++;
            showTriviaQuestion(triviaIndex);
        }
    });
}

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar variables globales
    productosBtn = document.getElementById('productos-btn');
    productosSection = document.getElementById('productos');
    inicioSection = document.getElementById('inicio');
    inicioBtn = document.querySelector('.nav-links a[href="#home"]');

    // Inicializar productos y carrito
    renderProducts();
    updateCartCount();

    // Event listeners para productos y carrito
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

    // Event listeners para navegación entre secciones
    productosBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchSection(productosSection, inicioSection);
    });
    
    inicioBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchSection(inicioSection, productosSection);
        setTimeout(refreshInstagramEmbeds, 100);
    });

    // Inicializar trivia
    initTrivia();

    // Modal de trivia
    const modal = document.getElementById('trivia-modal');
    const closeBtn = document.getElementById('trivia-close');
    const mainHome = document.getElementById('home');
    const footer = document.querySelector('.footer');
    const body = document.body;
    
    // Función para cerrar trivia
    function closeTrivia() {
        modal.style.display = 'none';
        body.classList.remove('no-scroll');
        document.documentElement.style.position = '';
        document.documentElement.style.height = '';
        document.documentElement.style.width = '';
        document.documentElement.style.overflow = '';
        
        setTimeout(() => {
            mainHome.classList.add('visible');
            footer.classList.add('visible');
            setTimeout(refreshInstagramEmbeds, 200);
        }, 100);
    }
    
    // Mostrar modal después de carga
    setTimeout(() => { 
        modal.style.display = 'flex';
        body.classList.add('no-scroll');
        // Para Safari: fijar el html también
        document.documentElement.style.position = 'fixed';
        document.documentElement.style.height = '100%';
        document.documentElement.style.width = '100%';
        document.documentElement.style.overflow = 'hidden';
    }, 600);
    
    // Event listeners del modal
    closeBtn.onclick = closeTrivia;
    modal.onclick = (e) => { if (e.target === modal) closeTrivia(); };
});
