// Shared DOM references
const hamburger = document.querySelector('.hamburger');
const navPanel = document.querySelector('.nav-panel');
const cartButton = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartItemCount = document.getElementById('cartItemCount');
const toast = document.getElementById('toast');

// Cart is stored in an array and synced with localStorage
let cart = [];

function showMessage(message) {
    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(showMessage.timeoutId);
    showMessage.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

function saveCart() {
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
}

function loadCart() {
    const storedCart = localStorage.getItem('restaurantCart');

    if (!storedCart) {
        cart = [];
        updateCartCount();
        return;
    }

    try {
        cart = JSON.parse(storedCart);
    } catch (error) {
        cart = [];
    }

    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (cartItemCount) {
        cartItemCount.textContent = totalItems;
    }
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    renderCartPreview();
}

function setupNavbar() {
    if (hamburger && navPanel) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navPanel.classList.toggle('active');
        });
    }

    if (cartButton) {
        cartButton.addEventListener('click', () => {
            // Cart button remains informational without a top popup.
            updateCartCount();
        });
    }
}

function setupMenuPage() {
    const menuGrid = document.getElementById('menuGrid');
    const searchInput = document.getElementById('menuSearch');
    const searchBtn = document.getElementById('searchBtn');
    const filterButtons = document.querySelectorAll('.category-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!menuGrid) {
        return;
    }

    const cards = Array.from(menuGrid.querySelectorAll('.dish-card'));
    let activeFilter = null;

    function getVisibleCards() {
        const term = searchInput ? searchInput.value.trim().toLowerCase() : '';

        return cards.filter(card => {
            const category = card.dataset.category;
            const name = card.dataset.name.toLowerCase();
            const description = card.dataset.description.toLowerCase();

            // If no category is selected, show nothing until the user clicks a button.
            if (activeFilter === null) {
                return false;
            }

            const matchesCategory = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = !term || name.includes(term) || description.includes(term);

            return matchesCategory && matchesSearch;
        });
    }

    function applyMenuState() {
        const visibleCards = getVisibleCards();

        cards.forEach(card => {
            card.classList.toggle('is-hidden', !visibleCards.includes(card));
        });

        if (loadMoreBtn) {
            loadMoreBtn.classList.add('is-hidden');
        }

        let emptyState = menuGrid.querySelector('.empty-state');
        if (visibleCards.length === 0) {
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.textContent = activeFilter === null
                    ? 'Select a category to see dishes.'
                    : 'No menu items match your search. Try another keyword or category.';
                menuGrid.appendChild(emptyState);
            } else if (activeFilter !== null) {
                emptyState.textContent = 'No menu items match your search. Try another keyword or category.';
            }
        } else if (emptyState) {
            emptyState.remove();
        }
    }

    // Add click handler to dish cards to navigate to detail page
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const dishName = card.dataset.name;
            const dishCategory = card.dataset.category;
            // Navigate to dish detail page
            window.location.href = `dish-detail.html?name=${encodeURIComponent(dishName)}&category=${encodeURIComponent(dishCategory)}`;
        });
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            activeFilter = button.dataset.filter;
            filterButtons.forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            applyMenuState();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyMenuState();
        });

        searchInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                applyMenuState();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            applyMenuState();
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            applyMenuState();
        });
    }

    menuGrid.querySelectorAll('.add-to-cart-btn:not(:disabled)').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.dish-card');
            addToCart(card.dataset.name, Number(card.dataset.price));
        });
    });

    if (activeFilter !== null) {
        filterButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.filter === activeFilter);
        });
    }

    applyMenuState();
}

function renderCartPreview() {
    const cartPreview = document.getElementById('cartPreview');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartPreview || !cartTotal) {
        return;
    }

    if (cart.length === 0) {
        cartPreview.innerHTML = '<div class="empty-state">Your cart is empty. Add items from the menu page first.</div>';
        cartTotal.textContent = '₹0';
        return;
    }

    let total = 0;
    cartPreview.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-preview-item" data-name="${item.name}">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">
                    <div class="cart-qty-controls">
                        <button class="qty-control minus" type="button" data-action="decrease" data-name="${item.name}">−</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="qty-control plus" type="button" data-action="increase" data-name="${item.name}">+</button>
                    </div>
                    <div class="cart-item-price">₹${item.price} x ${item.quantity} = ₹${itemTotal}</div>
                    <button class="remove-item" type="button" data-action="remove" data-name="${item.name}">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    cartTotal.textContent = `₹${total}`;

    attachCartPreviewListeners();
}

function attachCartPreviewListeners() {
    const cartPreview = document.getElementById('cartPreview');
    if (!cartPreview) {
        return;
    }

    cartPreview.querySelectorAll('.qty-control, .remove-item').forEach(button => {
        button.addEventListener('click', event => {
            const action = button.dataset.action;
            const name = button.dataset.name;

            if (action === 'increase') {
                changeCartQuantity(name, 1);
            } else if (action === 'decrease') {
                changeCartQuantity(name, -1);
            } else if (action === 'remove') {
                removeCartItem(name);
            }
        });
    });
}

function changeCartQuantity(name, delta) {
    const existingItem = cart.find(item => item.name === name);
    if (!existingItem) {
        return;
    }

    const newQuantity = existingItem.quantity + delta;
    if (newQuantity < 1) {
        removeCartItem(name);
        return;
    }

    existingItem.quantity = newQuantity;
    saveCart();
    updateCartCount();
    renderCartPreview();
}

function removeCartItem(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartCount();
    renderCartPreview();
}

function setFieldError(field, message) {
    const wrapper = field.closest('.form-group');
    const errorBox = wrapper ? wrapper.querySelector('.field-error') : null;

    field.classList.toggle('input-error', Boolean(message));
    if (errorBox) {
        errorBox.textContent = message || '';
    }
}

function validateOrderForm(form) {
    let isValid = true;
    const name = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const email = form.querySelector('#email');
    const address = form.querySelector('#address');
    const pincode = form.querySelector('#pincode');

    setFieldError(name, '');
    setFieldError(phone, '');
    setFieldError(email, '');
    setFieldError(address, '');
    setFieldError(pincode, '');

    if (!name.value.trim()) {
        setFieldError(name, 'Please enter your name.');
        isValid = false;
    }

    if (!phone.value.trim()) {
        setFieldError(phone, 'Please enter your phone number.');
        isValid = false;
    } else if (!/^[6-9][0-9]{9}$/.test(phone.value.trim())) {
        setFieldError(phone, 'Enter a valid 10-digit Indian mobile number.');
        isValid = false;
    }

    if (!email.value.trim()) {
        setFieldError(email, 'Please enter your email address.');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setFieldError(email, 'Please enter a valid email address.');
        isValid = false;
    }

    if (!address.value.trim()) {
        setFieldError(address, 'Please enter your delivery address.');
        isValid = false;
    }

    if (!pincode.value.trim()) {
        setFieldError(pincode, 'Please enter your pincode.');
        isValid = false;
    } else if (!/^[0-9]{6}$/.test(pincode.value.trim())) {
        setFieldError(pincode, 'Enter a valid 6-digit pincode.');
        isValid = false;
    }

    if (cart.length === 0) {
        showMessage('Your cart is empty. Add menu items before placing an order.');
        isValid = false;
    }

    return isValid;
}

function setupOrderForm() {
    const orderForm = document.getElementById('orderForm');
    const proceedBtn = document.getElementById('proceedBtn');

    renderCartPreview();

    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showMessage('Your cart is empty. Add items first.');
                return;
            }
            if (!validateOrderForm(orderForm)) {
                showMessage('Please fill in all required delivery details.');
                return;
            }
            // Save order details to localStorage
            const orderDetails = {
                cart: [...cart],
                customer: {
                    name: orderForm.querySelector('#name').value.trim(),
                    phone: orderForm.querySelector('#phone').value.trim(),
                    email: orderForm.querySelector('#email').value.trim(),
                    address: orderForm.querySelector('#address').value.trim(),
                    pincode: orderForm.querySelector('#pincode').value.trim()
                },
                total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
            };
            localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
            // Redirect to orders page
            window.location.href = 'orders.html';
        });
    }

    // Remove old payment button handlers since they are moved to orders page
}

function validateFeedbackForm(form) {
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const comments = form.querySelector('[name="comments"]');
    const ratingError = form.querySelectorAll('.field-error')[2];
    const selectedRating = form.querySelector('input[name="rating"]:checked');
    let isValid = true;

    setFieldError(name, '');
    setFieldError(email, '');
    setFieldError(comments, '');
    if (ratingError) {
        ratingError.textContent = '';
    }

    if (!name.value.trim()) {
        setFieldError(name, 'Please enter your name.');
        isValid = false;
    }

    if (!email.value.trim()) {
        setFieldError(email, 'Please enter your email.');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setFieldError(email, 'Please enter a valid email address.');
        isValid = false;
    }

    if (!selectedRating && ratingError) {
        ratingError.textContent = 'Please select a rating.';
        isValid = false;
    }

    if (!comments.value.trim()) {
        setFieldError(comments, 'Please share your feedback.');
        isValid = false;
    }

    return isValid;
}

function setupOrdersPage() {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    if (!orderDetails) {
        // If no order details, redirect to cart
        window.location.href = 'cart.html';
        return;
    }

    const orderPreview = document.getElementById('orderPreview');
    const orderTotal = document.getElementById('orderTotal');
    const deliveryInfo = document.getElementById('deliveryInfo');
    const cashOnDeliveryBtn = document.getElementById('cashOnDeliveryBtn');
    const payOnlineBtn = document.getElementById('payOnlineBtn');

    if (!orderPreview || !orderTotal || !deliveryInfo) {
        return;
    }

    // Display order items
    orderPreview.innerHTML = orderDetails.cart.map(item => `
        <div class="cart-preview-item">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-details">
                <div class="cart-item-price">₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</div>
            </div>
        </div>
    `).join('');

    orderTotal.textContent = `₹${orderDetails.total}`;

    // Display delivery details
    deliveryInfo.innerHTML = `
        <p><strong>Name:</strong> ${orderDetails.customer.name}</p>
        <p><strong>Phone:</strong> ${orderDetails.customer.phone}</p>
        <p><strong>Email:</strong> ${orderDetails.customer.email}</p>
        <p><strong>Address:</strong> ${orderDetails.customer.address}</p>
        <p><strong>Pincode:</strong> ${orderDetails.customer.pincode}</p>
    `;

    // Handle payment buttons
    if (cashOnDeliveryBtn) {
        cashOnDeliveryBtn.addEventListener('click', () => {
            showMessage(`Thank you ${orderDetails.customer.name}. Your order has been placed with Cash on Delivery.`);
            alert(`Thank you ${orderDetails.customer.name}! Your order has been placed with Cash on Delivery.`);
            // Clear cart and order details
            cart = [];
            saveCart();
            updateCartCount();
            localStorage.removeItem('orderDetails');
            // Redirect to home or menu
            window.location.href = 'index.html';
        });
    }

    if (payOnlineBtn) {
        payOnlineBtn.addEventListener('click', () => {
            const upiUrl = `upi://pay?pa=merchant@upi&pn=Restaurant%20Elegance&am=${orderDetails.total}&cu=INR&tn=Food%20Order`;
            window.location.href = upiUrl;
            showMessage('Redirecting to payment app...');
            // Note: In a real app, handle payment success to clear cart
            localStorage.removeItem('orderDetails');
        });
    }
}

function setupFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (!feedbackForm) {
        return;
    }

    feedbackForm.addEventListener('submit', event => {
        event.preventDefault();

        if (!validateFeedbackForm(feedbackForm)) {
            showMessage('Please complete the feedback form correctly.');
            return;
        }

        const customerName = feedbackForm.querySelector('[name="name"]').value.trim();
        showMessage(`Thanks ${customerName}, your feedback has been submitted.`);
        alert(`Thank you ${customerName}! Your feedback has been submitted successfully.`);
        feedbackForm.reset();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupNavbar();
    setupMenuPage();
    setupOrderForm();
    setupFeedbackForm();
});
