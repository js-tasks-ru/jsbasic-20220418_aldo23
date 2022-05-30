import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.elem = this.render();
    this.elem.addEventListener('click', this.addProduct);

    this.carouselInner = this.elem.querySelector('.carousel__inner'),
    this.slidesQuality = this.elem.querySelectorAll('.carousel__slide').length,
    this.arrowLeft = this.elem.querySelector('.carousel__arrow_left'),
    this.arrowRight = this.elem.querySelector('.carousel__arrow_right');
    this.currentSlide = 1;
    this.nextPosition = 0;
    this.arrowLeft.style.display = 'none';
  }

  // Метод отрисовывает карусель
  render() {
    // Создаем carousel
    let carousel = createElement(`
      <div class="carousel">
        <div class="carousel__arrow carousel__arrow_right">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left">
          <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>
      </div>
    `);

    // Создаем carousel__inner
    let carouselInner = createElement(`
      <div class="carousel__inner"></div>
    `);    
    for(let slide of this.slides) {
      carouselInner.insertAdjacentElement('beforeend', this.renderSlide(slide));
    }

    // Добавляем carousel__inner в carousel
    carousel.insertAdjacentElement('beforeend', carouselInner);

    // Добавляем обработчик переключения слайдов
    carousel.addEventListener('click', this.switchSlide);

    return carousel;
  }

  // Метод отрисовывает один слайд
  renderSlide(slide) {
    return createElement(`
      <div class="carousel__slide" data-id="${slide.id}">
        <img src="/assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${slide.price.toFixed(2)}</span>
          <div class="carousel__title">${slide.name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `);
  }

  // Метод переключения слайдов
  switchSlide = (event) => {
    let arrow = event.target.closest('.carousel__arrow');

    if(!arrow) return;

    if(arrow.classList.contains('carousel__arrow_right')) {
      this.currentSlide++;
      this.nextPosition += this.carouselInner.offsetWidth;
      this.carouselInner.style.transform = `translateX(-${this.nextPosition}px)`;
    } else {
      this.currentSlide--;
      this.nextPosition -= this.carouselInner.offsetWidth;
      this.carouselInner.style.transform = `translateX(-${this.nextPosition}px)`;
    }

    switch(this.currentSlide) {
      case 1:
        this.arrowLeft.style.display = 'none';
        break;
      case this.slidesQuality:
        this.arrowRight.style.display = 'none';
        break;
      default:
        this.arrowLeft.style.display = '';
        this.arrowRight.style.display = '';
    }
  }

  // Метод генерирует событие product-add
  addProduct = (event) => {
    if(event.target.closest('.carousel__button')) {
      let productAddEvent = new CustomEvent('product-add', {
        detail: event.target.closest('.carousel__slide').dataset.id,
        bubbles: true,
      });
      
      this.elem.dispatchEvent(productAddEvent);
    }
  }
}
