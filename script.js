// script.js


// Navigation mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');


if (menuToggle) {
menuToggle.addEventListener('click', () => {
navLinks.classList.toggle('active');
});
}


// Slider hero
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;


function showSlide(index) {
slides.forEach((slide, i) => {
slide.classList.remove('active');
if (i === index) {
slide.classList.add('active');
}
});
}


function nextSlide() {
currentSlide = (currentSlide + 1) % totalSlides;
showSlide(currentSlide);
}


function prevSlide() {
currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
showSlide(currentSlide);
}


if (slides.length > 0) {
setInterval(nextSlide, 5000);
}


// Filtres produits
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');


filterButtons.forEach(button => {
button.addEventListener('click', () => {
const filter = button.dataset.filter;


    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

});


// Ajout au panier
const addToCartButtons = document.querySelectorAll('.add-to-cart');
let cart = JSON.parse(localStorage.getItem('cart')) || [];


function updateCartCount() {
const cartCount = document.querySelector('.cart-count');
if (cartCount) {
cartCount.textContent = cart.length;
}
}


function saveCart() {
localStorage.setItem('cart', JSON.stringify(cart));
}


addToCartButtons.forEach(button => {
button.addEventListener('click', (e) => {
const productId = button.dataset.productId;
const productName = button.dataset.productName;
const productPrice = button.dataset.productPrice;


    cart.push({
        id: productId,
        name: productName,
        price: productPrice
    });
    
    saveCart();
    updateCartCount();
    showAddedToCartMessage();
});

});


function showAddedToCartMessage() {
const message = document.createElement('div');
message.className = 'cart-notification';
message.textContent = 'Produit ajouté au panier !';
document.body.appendChild(message);


setTimeout(() => {
    message.remove();
}, 2000);

}


// Scroll animations
const observerOptions = {
threshold: 0.1,
rootMargin: '0px 0px -50px 0px'
};


const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
}
});
}, observerOptions);


document.querySelectorAll('.product-card, .feature-item').forEach(el => {
observer.observe(el);
});


// Formulaire newsletter
const newsletterForm = document.querySelector('.newsletter-form');


if (newsletterForm) {
newsletterForm.addEventListener('submit', (e) => {
e.preventDefault();
const email = newsletterForm.querySelector('input[type="email"]').value;


    showNewsletterSuccess();
    newsletterForm.reset();
});

}


function showNewsletterSuccess() {
const message = document.createElement('div');
message.className = 'newsletter-success';
message.textContent = 'Merci pour votre inscription !';
document.body.appendChild(message);


setTimeout(() => {
    message.remove();
}, 3000);

}


// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
target.scrollIntoView({
behavior: 'smooth',
block: 'start'
});


        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    }
});

});


// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
updateCartCount();
});
