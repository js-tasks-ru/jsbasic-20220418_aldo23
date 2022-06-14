import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.addEventListeners();
  }

  addProduct(product) {
    if(!product) return;

    let cartItem = this.cartItems.find(
      item => item.product.id == product.id
    );

    if(!cartItem) {
      cartItem = {
        product: product,
        count: 1,
      }
      this.cartItems.push(cartItem);
    } else {
      cartItem.count++;
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find(
      item => item.product.id == productId
    );

    if(cartItem) {
      cartItem.count += amount;

      if(cartItem.count == 0) {
        this.cartItems = this.cartItems.filter(
          item => item !== cartItem
        );
      }

      this.onProductUpdate(cartItem);
    }
  }

  isEmpty() {
    return this.cartItems.length == 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((count, item) => count + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((price, item) => price + item.product.price * item.count, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    let modal = new Modal();
    modal.setTitle('Your order');

    // Формируем модальное окно
    let modalBody = createElement(`<div></div>`);
    let modalForm = this.renderOrderForm();

    for(let item of this.cartItems) {
      let itemElem = this.renderProduct(item.product, item.count);
      modalBody.append(itemElem);
    }

    modalBody.append(modalForm);
    modal.setBody(modalBody);
    
    modal.open();

    // Обработчик увеличения / уменьшения количества товара
    modal.elem.addEventListener('click', (event) => {
      if(event.target.closest('.cart-counter__button')) {
        let productId = event.target.closest('.cart-product').dataset.productId;
        let amount = 1;

        if(event.target.closest('.cart-counter__button_minus')) amount = -amount;

        this.updateProductCount(productId, amount);
      }
    });    
    
    // Обработчик события submit
    modalForm.addEventListener('submit', event => this.onSubmit(event));
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if(document.body.classList.contains('is-modal-open')) {
      let productId = cartItem.product.id;
      let modalBody = document.querySelector('.modal');
      let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

      // Удаляем товар из модального окна, если он удален из корзины
      if(cartItem.count == 0) {
        let item = modalBody.querySelector(`[data-product-id="${productId}"]`);
        item.remove();

        infoPrice.innerHTML = `&#8364;${this.getTotalPrice().toFixed(2)}`;

        // Закрываем модальное окно, если корзина пуста
        if(this.getTotalCount() == 0) {
          let closeButton = modalBody.querySelector('.modal__close');
          let event = new Event('click', {bubbles: true});
          closeButton.dispatchEvent(event);
          return;
        }

        return;
      }

      // Обновляем верстку в модальном окне
      let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);

      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `&#8364;${(cartItem.count * cartItem.product.price).toFixed(2)}`;
      infoPrice.innerHTML = `&#8364;${this.getTotalPrice().toFixed(2)}`;
    }
  }

  onSubmit(event) {
    event.preventDefault();

    let modal = document.querySelector('.modal');
    let modalForm = modal.querySelector('.cart-form');

    let submitButton = modalForm.querySelector(`[type="submit"]`);
    submitButton.classList.add('is-loading');

    let formData = new FormData(modalForm);

    // Отправляем запрос на сервер
    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: formData,
    }).then(response => {
      if(response.ok) {
        // Очищаем корзину
        this.cartItems = [];
        this.cartIcon.update(this);

        // Изменяем вид модального окна
        let modalTitle = modal.querySelector('.modal__title');
        modalTitle.innerHTML = 'Success!';

        let modalBody = modal.querySelector('.modal__body');
        modalBody.innerHTML = '';
        modalBody.insertAdjacentElement('beforeend', createElement(`
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>
        `));
      }
    });
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

