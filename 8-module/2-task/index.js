import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.render();
  }

  render() {
    this.elem = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
    `);

    let prodGridInner = this.elem.querySelector('.products-grid__inner');
    for(let product of this.products) {
      let card = new ProductCard(product);
      prodGridInner.append(card.elem);
    }
  }

  updateFilter(filters) {
    Object.assign(this.filters, filters);    
    let filterProducts = this.products;

    // Фильтруем массив
    if(this.filters.noNuts) {
      filterProducts = filterProducts.filter(
        item => item.nuts === undefined || item.nuts === false
      );
    }

    if(this.filters.vegeterianOnly) {
      filterProducts = filterProducts.filter(
        item => item.vegeterian === true
      );
    }

    if(this.filters.maxSpiciness || this.filters.maxSpiciness == 0) {
      filterProducts = filterProducts.filter(
        item => item.spiciness <= this.filters.maxSpiciness
      );
    }

    if(this.filters.category) {
      filterProducts = filterProducts.filter(
        item => item.category == this.filters.category
      );
    }

    // Очищаем products-grid__inner
    let prodGridInner = this.elem.querySelector('.products-grid__inner');
    prodGridInner.innerHTML = '';

    // Формируем products-grid__inner
    for(let product of filterProducts) {
      let card = new ProductCard(product);
      prodGridInner.append(card.elem);
    }
  }
}
