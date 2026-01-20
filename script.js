// script.js

// Animation smooth scroll pour navigation
document.addEventListener('DOMContentLoaded', function() {
    
    // Gestion du menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(animateOnScroll, observerOptions);
    const elementsToAnimate = document.querySelectorAll('.product-card, .hero-content');
    
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // Gestion du panier
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    // Header au scroll
    window.addEventListener('scroll', handleHeaderScroll);
});

function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

function animateOnScroll(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}

function addToCart(event) {
    const button = event.currentTarget;
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    
    // Animation feedback
    button.classList.add('added');
    button.textContent = 'Ajouté !';
    
    setTimeout(() => {
        button.classList.remove('added');
        button.textContent = 'Ajouter au panier';
    }, 2000);
    
    // Stockage panier (localStorage)
    updateCart(productName, productPrice);
    showNotification(`${productName} ajouté au panier`);
}

function updateCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
        if (cart.length > 0) {
            cartCount.classList.add('active');
        }
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Filtre produits
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            setTimeout(() => product.classList.add('fade-in'), 100);
        } else {
            product.style.display = 'none';
        }
    });
}

// Recherche produits
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();
    
    products.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}
