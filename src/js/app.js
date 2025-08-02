document.addEventListener('DOMContentLoaded', () => {

    
    const cars = [
        {
            id: 1, name: "Audi RS E-Tron GT", category: "Electric", price: "130,000", image: "assets/images/etron.png", special: true,
            description: "The future of performance. All-electric, brutally fast, and a statement of progressive luxury.",
            features: ["0-60 in 3.1s", "400-mile range", "800-volt architecture", "Carbon fiber roof"],
        },
        {
            id: 2, name: "Audi RS7 ABT Legacy", category: "Sports", price: "295,000", image: "assets/images/rs7.png",
            description: "A symphony of design and unbridled power. The ABT Legacy edition is a driver's dream with a roaring V8.",
            features: ["4.0L V8 Bi-Turbo", "Top Speed: 205 mph", "Carbon Ceramic Brakes", "Adaptive Sport Suspension"],
        },
        {
            id: 3, name: "Lamborghini Urus", category: "SUV", price: "545,000", image: "assets/images/urus.png",
            description: "The world's first Super Sport Utility Vehicle. Luxury and utility in perfect, aggressive harmony.",
            features: ["4.0L Twin-Turbo V8", "7-Seater Capacity", "Air-ride Suspension", "23-inch Alloy Wheels"],
        },
        {
            id: 4, name: "Porsche Taycan", category: "Electric", price: "165,000", image: "assets/images/taycan.png",
            description: "The soul of Porsche, electrified. A smart, sleek, and silent sports car for the new era.",
            features: ["450-mile range", "15-min Supercharge", "Minimalist Interior", "Full Glass Canopy"],
        },
        {
            id: 5, name: "Aston Martin DBS", category: "Sports", price: "330,000", image: "assets/images/aston.png",
            description: "Unleash raw, British power. The DBS is a track-focused GT designed for pure speed and elegance.",
            features: ["5.2L Twin-Turbo V12", "0-60 in 3.2s", "Active Aerodynamics", "Lightweight Carbon Body"],
        },
    ];

    // STATE: Client-side memory 
    let cart = [];

    //DOM Element Selections 
    const carGrid = document.querySelector('.car-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cartIconWrapper = document.querySelector('.cart-icon-wrapper');
    const cartCount = document.querySelector('.cart-count');
    const contactForm = document.getElementById('contact-form');
    // Details Modal
    const detailsModalOverlay = document.getElementById('details-modal-overlay');
    const detailsModalContent = document.querySelector('.modal-content-wrapper');
    const closeDetailsModalBtn = document.querySelector('.close-modal-btn');
    // Cart Modal
    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    const cartModalContent = document.querySelector('.cart-content-wrapper');
    const closeCartModalBtn = document.getElementById('close-cart-btn');

    // RENDER FUNCTIONS

    const renderCatalogue = (filter = 'all') => {
        carGrid.innerHTML = '';
        const filteredCars = cars.filter(car => filter === 'all' || car.category === filter);
        filteredCars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = `car-card glass-panel ${car.special ? 'special-feature' : ''}`;
            carCard.dataset.id = car.id;
            carCard.innerHTML = `
                <div class="car-image-container"><img src="${car.image}" alt="${car.name}"></div>
                <div class="car-card-content">
                    <h3 class="car-name">${car.name}</h3>
                    <p class="car-category">${car.category}</p>
                    <p class="car-price">$${car.price}</p>
                    <div class="card-actions">
                        <button class="bouncy-button details-btn">Details</button>
                        <button class="add-to-cart-btn">
                             <svg class="cart-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2H1Z" /></svg>
                        </button>
                    </div>
                </div>`;
            carGrid.appendChild(carCard);
        });
        gsap.to('.car-card', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
    };

    const renderDetailsModal = (carId) => {
        const car = cars.find(c => c.id === carId);
        if (!car) return;
        detailsModalContent.innerHTML = `
            <div class="modal-layout">
                <div class="modal-image-gallery"><div class="main-image"><img src="${car.image}" alt="${car.name}" id="modal-car-image"></div></div>
                <div class="modal-info">
                    <h2>${car.name}</h2><p class="car-category">${car.category}</p>
                    <p class="car-description">${car.description}</p>
                    <ul class="features-list">${car.features.map(f => `<li>${f}</li>`).join('')}</ul>
                    <p class="car-price">$${car.price}</p>
                    <button class="bouncy-button add-to-cart-btn-modal" data-id="${car.id}">Add to Enquiry</button>
                </div>
            </div>`;
        detailsModalOverlay.classList.add('active');
        setupDetailsModalEventListeners(car);
    };

    const renderCartModal = () => {
        if (cart.length === 0) {
            cartModalContent.innerHTML = `<p class="empty-cart-message">Your enquiry cart is empty.</p>`;
        } else {
            let totalPrice = 0;
            const cartItemsHTML = cart.map(carId => {
                const car = cars.find(c => c.id === carId);
                totalPrice += parseInt(car.price.replace(/,/g, ''));
                return `
                    <div class="cart-item">
                        <img src="${car.image}" alt="${car.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <h4>${car.name}</h4>
                            <p>$${car.price}</p>
                        </div>
                        <button class="remove-from-cart-btn" data-id="${car.id}">×</button>
                    </div>
                `;
            }).join('');

            cartModalContent.innerHTML = `
                <div class="cart-items-list">${cartItemsHTML}</div>
                <div class="cart-summary">
                    <h3>Total Value: <span>$${totalPrice.toLocaleString()}</span></h3>
                </div>
            `;
        }
        cartModalOverlay.classList.add('active');
    };

    // EVENT HANDLERS LOGIC 

    // Global click handler for car cards
    carGrid.addEventListener('click', (e) => {
        const carCard = e.target.closest('.car-card');
        if (!carCard) return;
        const carId = parseInt(carCard.dataset.id);
        if (e.target.closest('.details-btn')) renderDetailsModal(carId);
        if (e.target.closest('.add-to-cart-btn')) addToCart(carId, e.target.closest('.add-to-cart-btn'));
    });

    const addToCart = (carId, buttonElement) => {
        if (!cart.includes(carId)) {
            cart.push(carId);
            updateCartCount();
            gsap.to(buttonElement, { scale: 1.2, duration: 0.2, ease: 'power2.out', onComplete: () => gsap.to(buttonElement, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.3)' }) });
            gsap.fromTo(cartIconWrapper, { scale: 1 }, { scale: 1.3, yoyo: true, repeat: 1, duration: 0.3, ease: 'power2.inOut' });
        }
    };

    const removeFromCart = (carId) => {
        cart = cart.filter(id => id !== carId);
        updateCartCount();
        renderCartModal(); 
    };

    const updateCartCount = () => {
        cartCount.textContent = cart.length;
        gsap.fromTo(cartCount, { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    };

    // Modal Closing Logic
    const closeAllModals = () => {
        detailsModalOverlay.classList.remove('active');
        cartModalOverlay.classList.remove('active');
    };
    [closeDetailsModalBtn, closeCartModalBtn, detailsModalOverlay, cartModalOverlay].forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el) closeAllModals();
        });
    });

    const setupDetailsModalEventListeners = (car) => {
        const addToCartModalBtn = document.querySelector('.add-to-cart-btn-modal');
        addToCartModalBtn.addEventListener('click', () => addToCart(car.id, addToCartModalBtn));
    };

    //Event delegation for remove button inside cart
    cartModalContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const carId = parseInt(e.target.dataset.id);
            removeFromCart(carId);
        }
    });

    // Filtering Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCatalogue(btn.dataset.filter);
        });
    });

    // Form Logic
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = contactForm.querySelector('button[type="submit"]');
        if (contactForm.checkValidity()) {
            button.textContent = "Sending...";
            gsap.fromTo('.form-group', { y: 0 }, { y: -10, stagger: 0.1, yoyo: true, repeat: 1, duration: 0.2, ease: 'power2.inOut' });
            setTimeout(() => {
                button.textContent = "Submitted!";
                button.style.background = "#28a745";
                contactForm.reset();
                setTimeout(() => { button.textContent = "Submit Enquiry"; button.style.background = ""; }, 3000);
            }, 2000);
        } else {
            gsap.fromTo(contactForm, { x: 0 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power1.inOut', clearProps: 'x' });
        }
    });

    // Cart Icon Click
    cartIconWrapper.addEventListener('click', renderCartModal);

    // INITIALIZATION
    const init = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.hero-title', { opacity: 1, y: 0, duration: 1, delay: 0.2 })
            .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1 }, "-=0.8")
            .to('.hero-content .bouncy-button', { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.7)' }, "-=0.8")
            .to('.hero-car-img', { opacity: 1, x: 0, duration: 1.5 }, "-=0.8")
            .to('.scroll-down-indicator', { opacity: 1, duration: 1 }, "-=0.5");
        renderCatalogue();
    };
    init();
});