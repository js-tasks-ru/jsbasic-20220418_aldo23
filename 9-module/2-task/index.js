import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    // Рисуем карусель
    this.carousel = new Carousel(slides);
    let carouselElem = document.querySelector('[data-carousel-holder]');
    carouselElem.append(this.carousel.elem);

    // Рисуем меню
    this.ribbonMenu = new RibbonMenu(categories);
    let ribbonMenuElem = document.querySelector('[data-ribbon-holder');
    ribbonMenuElem.append(this.ribbonMenu.elem);

    // Рисуем слайдер
    this.stepSlider = new StepSlider({steps: 5, value: 3});
    let stepSliderElem = document.querySelector('[data-slider-holder]');
    stepSliderElem.append(this.stepSlider.elem);

    // Рисуем иконку корзины
    this.cartIcon = new CartIcon();
    let cartIconElem = document.querySelector('[data-cart-icon-holder]');
    cartIconElem.append(this.cartIcon.elem);

    // Создаем корзину
    this.cart = new Cart(this.cartIcon);

    // Показываем список товаров
    let url = 'products.json';
    this.products = await fetch(url)
      .then(response => response.json())
      .then(data => data);

    this.productsGrid = new ProductsGrid(this.products);
    let productsGridElem = document.querySelector('[data-products-grid-holder]');
    productsGridElem.innerHTML = '';
    productsGridElem.append(this.productsGrid.elem);

    // Фильтруем товары по текущим значениям
    this.productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegetarianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value,
    });

    // Добавляем обработчики событий
    document.body.addEventListener('product-add', event => {
      console.log('Объект события = ', event.detail);
      let product = this.products.find(
        item => item.id == event.detail
      );
      this.cart.addProduct(product);
    });

    this.stepSlider.elem.addEventListener('slider-change', event => {
      this.productsGrid.updateFilter({
        maxSpiciness: event.detail
      });
    });

    this.ribbonMenu.elem.addEventListener('ribbon-select', event => {
      this.productsGrid.updateFilter({
        category: event.detail
      });
    });

    // Фильтрация по изменению чекбоксов
    let filtersElem = document.querySelector('.filters__inner');
    filtersElem.addEventListener('change', event => {
      if(event.target.id == 'nuts-checkbox') {
        this.productsGrid.updateFilter({
          noNuts: event.target.checked,
        });
      };

      if(event.target.id == 'vegeterian-checkbox') {
        this.productsGrid.updateFilter({
          vegeterianOnly: event.target.checked,
        });
      }
    });
  }
}
