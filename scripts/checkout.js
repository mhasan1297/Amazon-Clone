import { cart, removeFromCart, calculateCartQuantity, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js"

let cartSummaryHTML = '';

cart.forEach((cartItem) => {

    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product
        }
    })

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span class= "quantity-style">
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-links quantity-link-style" data-product-id="${matchingProduct.id}">
                Update
                </span>
                <input class="quantity-input style-on-updat js-quantity-count-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                <span class="save-quantity-link link-primary style-on-update" data-product-id="${matchingProduct.id}">Save</span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            <div class="delivery-option">
                <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                    FREE Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                    $4.99 - Shipping
                </div>
                </div>
            </div>
            <div class="delivery-option">
                <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    Monday, June 13
                </div>
                <div class="delivery-option-price">
                    $9.99 - Shipping
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    `;
});

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML

document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId
        removeFromCart(productId)
        const container = document.querySelector(
            `.js-cart-item-container-${productId}`)
        container.remove()
        updateCartQuantity()
    })
})

function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity()
    document.querySelector('.js-return-to-home-link')
    .innerHTML = `${cartQuantity} items`;
}

document.querySelectorAll('.js-update-links').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId
        document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity')
    })
    
})

document.querySelectorAll('.save-quantity-link').forEach((saveButton) => {
    saveButton.addEventListener('click', () => {
        const productId = saveButton.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        
        // Remove the editing class
        container.classList.remove('is-editing-quantity');
        
        // Get the new quantity value
        const newQuant = document.querySelector(`.js-quantity-count-${productId}`).value;
        
        // Check if the new quantity is a valid number
        if (newQuant >= 0 && newQuant < 1000) {
            // Convert the new quantity to an integer
            const newQuantInteger = parseInt(newQuant, 10);
            
            // Update the quantity in your data (e.g., cart)
            updateQuantity(productId, newQuantInteger);
            
            // Update the displayed quantity label
            const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
            quantityLabel.innerHTML = newQuantInteger;
            
            // Update the overall cart quantity
            updateCartQuantity();
        }
        
        document.querySelector(`.js-quantity-count-${productId}`).addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                // Trigger the click event on the save button when Enter is pressed
                saveButton.click();
            }
        });
    });

    // Add keypress event listener
});


updateCartQuantity()