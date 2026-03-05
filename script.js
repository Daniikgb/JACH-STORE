/* ==================== COMPLETE CATALOG ASSETS ==================== */
const PRODUCTS = [
    { id: 1, name: "JACH CORE BLANCA", price: 35000, category: "t-shirts", image: "basicablanca.png", featured: true },
    { id: 2, name: "JACH CORE NEGRA", price: 35000, category: "t-shirts", image: "basicanegra.png", featured: true },
    { id: 3, name: "MIDNIGHT BASIC", price: 35000, category: "t-shirts", image: "basicanegra2.png", featured: false },
    { id: 4, name: "CONJUNTO STREET GEAR", price: 120000, category: "hoodies", image: "conjuntogood.png", featured: true },
    { id: 5, name: "REMERA BOX TEE", price: 45000, category: "t-shirts", image: "oversize.png", featured: true },
    { id: 6, name: "POLO DE ARCHIVO", price: 55000, category: "t-shirts", image: "polos.png", featured: false },
    { id: 7, name: "POLO RAYADA II", price: 55000, category: "t-shirts", image: "polos2.png", featured: false },
    { id: 8, name: "GRAVITY OVERSIZE", price: 48000, category: "t-shirts", image: "remeraoverisize.png", featured: true },
    { id: 9, name: "ESENCIAL URBANO", price: 42000, category: "t-shirts", image: "remeras.png", featured: false },
    { id: 10, name: "REMERA DROP SHOULDER", price: 45000, category: "t-shirts", image: "remeras2.png", featured: false },
    { id: 11, name: "JERSEY RETRÔ V1", price: 65000, category: "accessories", image: "vintaje.png", featured: true },
    { id: 12, name: "JERSEY RETRÔ B2", price: 65000, category: "accessories", image: "vintaje2.png", featured: false },
    { id: 13, name: "JERSEY RETRÔ Y3", price: 65000, category: "accessories", image: "vintaje3.png", featured: false },
    { id: 14, name: "JERSEY RETRÔ R4", price: 65000, category: "accessories", image: "vintaje4.png", featured: false },
    { id: 15, name: "PACK BÁSICOS", price: 95000, category: "t-shirts", image: "basicos.png", featured: false },
    { id: 16, name: "PACK MONO II", price: 95000, category: "t-shirts", image: "remerasmonocormaticas.png", featured: false }
];

/* ==================== STATE ==================== */
let cart = JSON.parse(localStorage.getItem('jach_cart')) || [];

/* ==================== DOM ELEMENTS ==================== */
const elements = {
    header: document.getElementById('header'),
    navMenu: document.getElementById('nav-menu'),
    navToggle: document.getElementById('nav-toggle'),
    navClose: document.getElementById('nav-close'),
    navLinks: document.querySelectorAll('.nav__link'),
    cartBtn: document.getElementById('cart-btn'),
    cartPanel: document.getElementById('cart-panel'),
    cartOverlay: document.getElementById('cart-overlay'),
    cartClose: document.getElementById('cart-close'),
    cartItems: document.getElementById('cart-items'),
    cartCount: document.getElementById('cart-count'),
    cartTotal: document.getElementById('cart-total'),
    featuredGrid: document.getElementById('featured-products'),
    catalogGrid: document.getElementById('catalog-products'),
    homeView: document.getElementById('home-view'),
    catalogView: document.getElementById('catalog-view'),
    filterBtns: document.querySelectorAll('.filter-chip'),
    checkoutBtn: document.getElementById('checkout-btn'),
    checkoutModal: document.getElementById('checkout-modal'),
    checkoutClose: document.getElementById('checkout-close-modal'),
    checkoutOptions: document.querySelectorAll('.checkout-option')
};

/* ==================== CORE FUNCTIONS ==================== */

// Mobile Nav
elements.navToggle.addEventListener('click', () => elements.navMenu.classList.add('show'));
elements.navClose.addEventListener('click', () => elements.navMenu.classList.remove('show'));

// Cart Toggle
const toggleCart = () => {
    elements.cartPanel.classList.toggle('show');
    elements.cartOverlay.classList.toggle('show');
}
elements.cartBtn.addEventListener('click', toggleCart);
elements.cartClose.addEventListener('click', toggleCart);
elements.cartOverlay.addEventListener('click', toggleCart);

// View Switching
function switchView(view, anchor = null) {
    if (view === 'catalog') {
        elements.homeView.style.display = 'none';
        elements.catalogView.style.display = 'block';
    } else {
        elements.homeView.style.display = 'block';
        elements.catalogView.style.display = 'none';
    }

    // Handle Scrolling
    if (anchor) {
        const target = document.querySelector(anchor);
        if (target) {
            const headerOffset = 100; // Approximated
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - (view === 'home' ? headerOffset : 50);

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    } else {
        window.scrollTo(0, 0);
    }

    // CSS Active State
    elements.navLinks.forEach(link => link.classList.remove('active-link'));
    if (view === 'home' && !anchor) document.getElementById('nav-home').classList.add('active-link');
    if (view === 'catalog') document.getElementById('nav-catalog').classList.add('active-link');
    if (anchor === '#lookbook') document.getElementById('nav-gallery').classList.add('active-link');

    elements.navMenu.classList.remove('show');
}

// Event Listeners for switching views

// Checkout Modal
elements.checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return alert("El carrito está vacío");
    elements.checkoutModal.classList.add('show');
});
elements.checkoutClose.addEventListener('click', () => elements.checkoutModal.classList.remove('show'));

elements.checkoutOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        const phone = opt.dataset.wa;
        sendOrder(phone);
    });
});

function sendOrder(phone) {
    let message = "🛍️ *NUEVO PEDIDO DE JACH STORE* \n\n";
    cart.forEach(item => {
        message += `- ${item.name} (${item.qty}x) - Gs. ${(item.price * item.qty).toLocaleString()}\n`;
    });

    const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
    message += `\n💰 *TOTAL:* Gs. ${total.toLocaleString()}`;
    message += `\n\n📌 *Hola! Me gustaría coordinar mi pedido.*`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');

    // Clear cart after order? (optional)
    // cart = [];
    // saveCart();
    // updateCartUI();
    elements.checkoutModal.classList.remove('show');
}

/* ==================== RENDERING ==================== */

function getProductHTML(p) {
    return `
        <article class="card">
            <div class="card__img-box">
                <img src="${p.image}" alt="${p.name}" class="card__img">
                <button class="card__add" onclick="addToCart(${p.id})">AGREGAR AL CARRITO</button>
            </div>
            <div class="card__data">
                <h3 class="card__title">${p.name}</h3>
                <span class="card__price">Gs. ${p.price.toLocaleString()}</span>
            </div>
        </article>
    `;
}

function render() {
    // Featured
    const featured = PRODUCTS.filter(p => p.featured);
    elements.featuredGrid.innerHTML = featured.map(p => getProductHTML(p)).join('');

    // Catalog
    elements.catalogGrid.innerHTML = PRODUCTS.map(p => getProductHTML(p)).join('');
}

// Filtering
elements.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        elements.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
        elements.catalogGrid.innerHTML = filtered.map(p => getProductHTML(p)).join('');
    });
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Navigation Listeners
    document.getElementById('nav-home').addEventListener('click', (e) => { e.preventDefault(); switchView('home'); });
    document.getElementById('nav-catalog').addEventListener('click', (e) => { e.preventDefault(); switchView('catalog'); });
    document.getElementById('nav-gallery').addEventListener('click', (e) => { e.preventDefault(); switchView('home', '#lookbook'); });
    document.getElementById('home-link').addEventListener('click', (e) => { e.preventDefault(); switchView('home'); });
    document.getElementById('hero-shop-btn').addEventListener('click', (e) => { e.preventDefault(); switchView('catalog'); });

    render();
    updateCartUI();

    // UX: Close modals on background click
    elements.checkoutModal.addEventListener('click', (e) => {
        if (e.target === elements.checkoutModal) elements.checkoutModal.classList.remove('show');
    });

    // UX: Close mobile menu on link click
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => elements.navMenu.classList.remove('show'));
    });
});

function showToast(text) {
    const toast = document.getElementById('toast');
    toast.innerText = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

window.addToCart = (id) => {
    const product = PRODUCTS.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);

    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });

    saveCart();
    updateCartUI();
    showToast("AÑADIDO AL CARRITO");
}

function saveCart() {
    localStorage.setItem('jach_cart', JSON.stringify(cart));
}

function updateCartUI() {
    elements.cartItems.innerHTML = cart.length === 0 ? '<p>EL CARRITO ESTÁ VACÍO</p>' :
        cart.map(item => `
            <div class="c-item">
                <img src="${item.image}">
                <div class="c-item__info">
                    <h4>${item.name}</h4>
                    <p>Gs. ${item.price.toLocaleString()} x ${item.qty}</p>
                    <button onclick="removeFromCart(${item.id})" style="font-size:0.7rem; color:red; margin-top:5px; font-weight:bold">QUITAR</button>
                </div>
            </div>
        `).join('');

    const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
    elements.cartTotal.innerText = `Gs. ${total.toLocaleString()}`;
    elements.cartCount.innerText = cart.reduce((acc, i) => acc + i.qty, 0);
}

window.removeFromCart = (id) => {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
}
