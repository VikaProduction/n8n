// script.js - Version optimisée avec architecture moderne

// ============================================
// GESTION D'ÉTAT CENTRALISÉE
// ============================================
const AppState = {
    cart: [],
    filteredCategory: 'all',
    isMenuOpen: false,
    scrollPosition: 0,
    favorites: [],
    viewMode: 'grid',
    searchQuery: '',
    sortBy: 'default'
};

// ============================================
// INITIALISATION PRINCIPALE
// ============================================
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    loadPersistedData();
    initMenuMobile();
    initScrollAnimations();
    initCartSystem();
    initHeaderScroll();
    initSmoothScroll();
    initLazyLoading();
    initFilterButtons();
    initSearchBar();
    initThemeToggle();
    initFavorites();
    initViewToggle();
    initQuickView();
    initScrollToTop();
    initProductHover();
    initParallax();
    initCounter();
    initSortOptions();
    initResponsiveGrid();
    initPerformanceOptimizations();
}

// ============================================
// PERSISTANCE DES DONNÉES
// ============================================
function loadPersistedData() {
    const savedCart = localStorage.getItem('cart');
    const savedFavorites = localStorage.getItem('favorites');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedCart) {
        AppState.cart = JSON.parse(savedCart);
        updateCartCount();
    }
    
    if (savedFavorites) {
        AppState.favorites = JSON.parse(savedFavorites);
    }
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Erreur de sauvegarde:', e);
    }
}

// ============================================
// MENU MOBILE
// ============================================
function initMenuMobile() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        if (AppState.isMenuOpen && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.menu-toggle')) {
            closeMenu();
        }
    });
}

function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    AppState.isMenuOpen = !AppState.isMenuOpen;
    navMenu.classList.toggle('active');
    document.body.style.overflow = AppState.isMenuOpen ? 'hidden' : '';
}

function closeMenu() {
    const navMenu = document.querySelector('.nav-menu');
    AppState.isMenuOpen = false;
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// ANIMATIONS AU SCROLL
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(animateOnScroll, observerOptions);
    const elementsToAnimate = document.querySelectorAll('.product-card, .hero-content');
    
    elementsToAnimate.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

function animateOnScroll(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}

// ============================================
// SYSTÈME DE PANIER
// ============================================
function initCartSystem() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

function addToCart(event) {
    const button = event.currentTarget;
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const productImage = productCard.querySelector('.product-image').src;
    
    const product = {
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
        id: Date.now()
    };
    
    animateAddToCart(button);
    updateCart(product);
    showNotification(`${productName} ajouté au panier`, 'success');
    animateCartIcon();
    triggerConfetti();
}

function animateAddToCart(button) {
    button.classList.add('added');
    button.textContent = 'Ajouté !';
    button.disabled = true;
    
    setTimeout(() => {
        button.classList.remove('added');
        button.textContent = 'Ajouter au panier';
        button.disabled = false;
    }, 2000);
}

function updateCart(product) {
    AppState.cart.push(product);
    saveToLocalStorage('cart', AppState.cart);
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = AppState.cart.length;
        if (AppState.cart.length > 0) {
            cartCount.classList.add('active');
        } else {
            cartCount.classList.remove('active');
        }
    }
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.animation = 'none';
        setTimeout(() => {
            cartIcon.style.animation = 'bounce 0.5s ease';
        }, 10);
    }
}

function clearCart() {
    AppState.cart = [];
    saveToLocalStorage('cart', AppState.cart);
    updateCartCount();
    showNotification('Panier vidé', 'info');
}

function removeFromCart(itemId) {
    AppState.cart = AppState.cart.filter(item => item.id !== itemId);
    saveToLocalStorage('cart', AppState.cart);
    updateCartCount();
    updateCartModal();
    showNotification('Produit retiré du panier', 'info');
}

// ============================================
// MODAL PANIER
// ============================================
function showCartModal() {
    const modalHTML = `
        <div class="cart-modal" id="cartModal">
            <div class="cart-modal-content">
                <div class="cart-modal-header">
                    <h2>Mon Panier</h2>
                    <button class="close-modal" onclick="closeCartModal()">✕</button>
                </div>
                <div class="cart-items" id="cartItems"></div>
                <div class="cart-total">
                    <h3>Total: <span id="cartTotal">0€</span></h3>
                    <button class="checkout-btn">Commander</button>
                    <button class="clear-cart-btn" onclick="clearCart()">Vider le panier</button>
                </div>
            </div>
        </div>
    `;
    
    if (!document.getElementById('cartModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    updateCartModal();
    document.getElementById('cartModal').classList.add('show');
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (AppState.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        cartTotal.textContent = '0€';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = AppState.cart.map(item => {
        const price = parseFloat(item.price.replace('€', '').replace(',', '.'));
        total += price;
        
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `${total.toFixed(2)}€`;
}

// Événement panier
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', showCartModal);
    }
});

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// HEADER AU SCROLL
// ============================================
function initHeaderScroll() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(() => {
        const header = document.querySelector('header');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (currentScroll > lastScroll && currentScroll > 300) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    }, 100));
}

// ============================================
// SCROLL FLUIDE
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// LAZY LOADING
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('.product-image');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.addEventListener('load', () => {
                    img.style.transition = 'opacity 0.5s';
                    img.style.opacity = '1';
                });
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// FILTRAGE DES PRODUITS
// ============================================
function initFilterButtons() {
    const filterContainer = document.querySelector('.products-section');
    if (!filterContainer) return;
    
    const filterHTML = `
        <div class="filter-controls">
            <button class="filter-btn active" data-filter="all">Tous</button>
            <button class="filter-btn" data-filter="homme">Homme</button>
            <button class="filter-btn" data-filter="femme">Femme</button>
        </div>
    `;
    
    filterContainer.insertAdjacentHTML('afterbegin', filterHTML);
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterProducts(this.dataset.filter);
        });
    });
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    AppState.filteredCategory = category;
    
    products.forEach((product, index) => {
        product.classList.remove('fade-in');
        
        if (category === 'all' || product.dataset.category === category) {
            setTimeout(() => {
                product.style.display = 'block';
                setTimeout(() => product.classList.add('fade-in'), 50);
            }, index * 50);
        } else {
            product.style.display = 'none';
        }
    });
}

// ============================================
// BARRE DE RECHERCHE
// ============================================
function initSearchBar() {
    const searchHTML = `
        <div class="search-container">
            <input type="text" class="search-input" placeholder="Rechercher un produit...">
            <span class="search-icon">🔍</span>
        </div>
    `;
    
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        const title = productsSection.querySelector('.section-title');
        title.insertAdjacentHTML('afterend', searchHTML);
        
        const searchInput = document.querySelector('.search-input');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProducts(e.target.value);
            }, 300);
        });
    }
}

function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase().trim();
    AppState.searchQuery = searchTerm;
    
    if (searchTerm === '') {
        filterProducts(AppState.filteredCategory);
        return;
    }
    
    products.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
            product.classList.add('fade-in');
        } else {
            product.style.display = 'none';
        }
    });
}

// ============================================
// THÈME SOMBRE
// ============================================
function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ============================================
// FAVORIS
// ============================================
function initFavorites() {
    document.querySelectorAll('.product-card').forEach(card => {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = '♡';
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(card, favoriteBtn);
        });
        card.appendChild(favoriteBtn);
    });
}

function toggleFavorite(card, btn) {
    const productName = card.querySelector('.product-name').textContent;
    const index = AppState.favorites.indexOf(productName);
    
    if (index > -1) {
        AppState.favorites.splice(index, 1);
        btn.innerHTML = '♡';
        btn.classList.remove('active');
        showNotification('Retiré des favoris', 'info');
    } else {
        AppState.favorites.push(productName);
        btn.innerHTML = '♥';
        btn.classList.add('active');
        showNotification('Ajouté aux favoris', 'success');
    }
    
    saveToLocalStorage('favorites', AppState.favorites);
}

// ============================================
// VUE GRILLE/LISTE
// ============================================
function initViewToggle() {
    const productsSection = document.querySelector('.products-section');
    if (!productsSection) return;
    
    const viewToggleHTML = `
        <div class="view-toggle">
            <button class="view-btn active" data-view="grid">⊞</button>
            <button class="view-btn" data-view="list">☰</button>
        </div>
    `;
    
    const filterControls = document.querySelector('.filter-controls');
    if (filterControls) {
        filterControls.insertAdjacentHTML('afterend', viewToggleHTML);
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                switchView(this.dataset.view);
            });
        });
    }
}

function switchView(view) {
    const grid = document.querySelector('.products-grid');
    AppState.viewMode = view;
    
    if (view === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
}

// ============================================
// APERÇU RAPIDE
// ============================================
function initQuickView() {
    document.querySelectorAll('.product-card').forEach(card => {
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.textContent = '👁 Aperçu rapide';
        quickViewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showQuickView(card);
        });
        card.querySelector('.product-info').appendChild(quickViewBtn);
    });
}

function showQuickView(card) {
    const name = card.querySelector('.product-name').textContent;
    const price = card.querySelector('.product-price').textContent;
    const image = card.querySelector('.product-image').src;
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-quick-view">✕</button>
            <img src="${image}" alt="${name}">
            <div class="quick-view-info">
                <h2>${name}</h2>
                <p class="quick-view-price">${price}</p>
                <p class="quick-view-description">T-shirt premium en coton biologique. Coupe moderne et confortable.</p>
                <div class="size-selector">
                    <button class="size-btn">S</button>
                    <button class="size-btn">M</button>
                    <button class="size-btn">L</button>
                    <button class="size-btn">XL</button>
                </div>
                <button class="add-to-cart-modal">Ajouter au panier</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    modal.querySelector('.close-quick-view').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
}

// ============================================
// SCROLL TO TOP
// ============================================
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// EFFETS HOVER
// ============================================
function initProductHover() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ============================================
// PARALLAX
// ============================================
function initParallax() {
    const hero = document.querySelector('.hero-content');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

// ============================================
// COMPTEUR ANIMÉ
// ============================================
function initCounter() {
    const stats = [
        { id: 'products-count', end: 1000, suffix: '+' },
        { id: 'customers-count', end: 5000, suffix: '+' },
        { id: 'satisfaction-count', end: 98, suffix: '%' }
    ];
    
    stats.forEach(stat => {
        animateCounter(stat.id, stat.end, stat.suffix);
    });
}

function animateCounter(id, end, suffix = '') {
    const element = document.getElementById(id);
    if (!element) return;
    
    let current = 0;
    const increment = end / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 20);
}

// ============================================
// TRI DES PRODUITS
// ============================================
function initSortOptions() {
    const sortHTML = `
        <div class="sort-container">
            <label for="sort-select">Trier par:</label>
            <select id="sort-select" class="sort-select">
                <option value="default">Par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name-asc">Nom A-Z</option>
                <option value="name-desc">Nom Z-A</option>
            </select>
        </div>
    `;
    
    const filterControls = document.querySelector('.filter-controls');
    if (filterControls) {
        filterControls.insertAdjacentHTML('beforebegin', sortHTML);
        
        document.getElementById('sort-select').addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
}

function sortProducts(sortBy) {
    const grid = document.querySelector('.products-grid');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const nameA = a.querySelector('.product-name').textContent;
        const nameB = b.querySelector('.product-name').textContent;
        const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('€', '').replace(',', '.'));
        const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('€', '').replace(',', '.'));
        
        switch(sortBy) {
            case 'price-asc': return priceA - priceB;
            case 'price-desc': return priceB - priceA;
            case 'name-asc': return nameA.localeCompare(nameB);
            case 'name-desc': return nameB.localeCompare(nameA);
            default: return 0;
        }
    });
    
    products.forEach(product => grid.appendChild(product));
}

// ============================================
// GRILLE RESPONSIVE
// ============================================
function initResponsiveGrid() {
    const updateGridColumns = () => {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;
        
        const width = window.innerWidth;
        if (width < 640) {
            grid.style.gridTemplateColumns = '1fr';
        } else if (width < 1024) {
            grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        }
    };
    
    updateGridColumns();
    window.addEventListener('resize', debounce(updateGridColumns, 250));
}

// ============================================
// OPTIMISATIONS PERFORMANCES
// ============================================
function initPerformanceOptimizations() {
    // Prefetch des images
    const images = document.querySelectorAll('.product-image');
    images.forEach(img => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = img.src;
        document.head.appendChild(link);
    });
    
    // Compression des événements
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Actions après resize
        }, 250);
    });
}

// ============================================
// CONFETTIS
// ============================================
function triggerConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000);
    }
}

// ============================================
// UTILITAIRES
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ============================================
// EXPORT GLOBAL
// ============================================
window.clearCart = clearCart;
window.closeCartModal = closeCartModal;
window.removeFromCart = removeFromCart;
window.toggleTheme = toggleTheme;