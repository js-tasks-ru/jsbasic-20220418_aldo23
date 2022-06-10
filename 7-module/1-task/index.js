import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.elem = this.render();
  }

  render() {
    // Создаем элемент ribbon__inner
    let ribbonInner = createElement(`
      <nav class="ribbon__inner"></nav>
    `);

    // Добавляем ссылки на категории
    for(let category of this.categories) {
      ribbonInner.insertAdjacentElement('beforeend', createElement(`
        <a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>
      `));
    }

    let ribbon = createElement(`
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
        ${ribbonInner.outerHTML}
        <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
      </div>
    `);

    ribbon.addEventListener('click', this.onArrowClick);
    ribbon.addEventListener('click', this.onItemClick);

    return ribbon;
  }

  onArrowClick = (event) => {
    let arrow = event.target.closest('.ribbon__arrow');
    
    if(!arrow) return;
    
    let ribbonInner = this.elem.querySelector('.ribbon__inner');
    
    if(arrow.classList.contains('ribbon__arrow_left')) {
      ribbonInner.scrollBy(-350, 0);
    } 
    
    if(arrow.classList.contains('ribbon__arrow_right')) {
      ribbonInner.scrollBy(350, 0);
    }

    // Создаем обработчик события scroll
    function onInnerScroll() {
      let scrollLeft  = ribbonInner.scrollLeft,
          scrollRight = ribbonInner.scrollWidth - scrollLeft - ribbonInner.clientWidth;

      if(arrow.classList.contains('ribbon__arrow_left')) {
        if(scrollLeft == 0) {
          arrow.classList.remove('ribbon__arrow_visible');
        } else {
          arrow.classList.add('ribbon__arrow_visible');
        }
      }

      if(arrow.classList.contains('ribbon__arrow_right')) {
        if(scrollRight < 1) {
          arrow.classList.remove('ribbon__arrow_visible');
        } else {
          arrow.classList.add('ribbon__arrow_visible');
        }
      }
    }

    ribbonInner.addEventListener('scroll', onInnerScroll);
  }

  onItemClick = (event) => {
    let currentItem = event.target.closest('.ribbon__item');
    if(currentItem) {
      // Останавливаем действия браузера по умолчанию
      event.preventDefault();

      // Выделяем стилями выбранную категорию
      let ribbonItems = event.target.closest('.ribbon__inner').children;
      
      for(let item of ribbonItems) {
        item.classList.remove('ribbon__item_active');
      }

      currentItem.classList.add('ribbon__item_active');

      // Генерируем пользовательское событие
      let ribbonSelect = new CustomEvent('ribbon-select', {
        detail: currentItem.dataset.id,
        bubbles: true,
      });

      this.elem.dispatchEvent(ribbonSelect);
    }
  }
}
