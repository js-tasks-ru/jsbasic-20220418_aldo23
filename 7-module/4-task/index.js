import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    
    this.elem = this.render();
  }

  // Возвращает элемент slider
  render() {
    // Формируем slider__steps
    let sliderSteps = createElement(`
      <div class="slider__steps"></div>
    `);

    for(let i = 0; i < this.steps; i++) {
      let sliderStep = document.createElement('SPAN');
      if( i == this.value ) {
        sliderStep.classList.add('slider__step-active');
      }
      sliderSteps.append(sliderStep);
    }

    // Считаем положение слайдера в процентах
    let sliderPercents = this.value / (this.steps - 1) * 100;

    // Формируем элемент slider и вешаем обработчики событий
    let slider = createElement(`
      <div class="slider">
        <div class="slider__thumb" style="left: ${sliderPercents}%;">
          <span class="slider__value">${this.value}</span>
        </div>
        <div class="slider__progress" style="width: ${sliderPercents}%;"></div>
        ${sliderSteps.outerHTML}
      </div>
    `);

    slider.addEventListener('click', this.onClick);

    let thumb = slider.querySelector('.slider__thumb');
    thumb.ondragstart = () => false;
    thumb.addEventListener('pointerdown', this.onPointerDown);

    return slider;
  }

  // Обработчик клика на slider
  onClick = (event) => {
    let clickValue = this.getClickValue(event.clientX);

    let thumb = this.elem.querySelector('.slider__thumb');
    let progress = this.elem.querySelector('.slider__progress');
    let slides = this.elem.querySelector('.slider__steps').children;

    let sliderPercents = clickValue / (this.steps - 1) * 100;

    // Меняем положение ползунка
    thumb.style.left = `${sliderPercents}%`;
    progress.style.width = `${sliderPercents}%`;
          
    // Новое значение в slider__value
    thumb.firstElementChild.innerHTML = clickValue;

    // Выделяем шаг на слайдере
    for(let slide of slides) {
      slide.classList.remove('slider__step-active');
    }
    slides[clickValue].classList.add('slider__step-active');

    if(this.value == clickValue) {
      return;
    } else {
      this.value = clickValue;

      // Генерируем событие slider-change
      let sliderChangeEvent = new CustomEvent('slider-change', {
        detail: this.value,
        bubbles: true,
      });
      this.elem.dispatchEvent(sliderChangeEvent);
    }
  }

  // Возвращает номер шага
  getClickValue(clientX) {
    let left = clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;

    let segments = this.steps - 1;

    let value = Math.round(leftRelative * segments);

    return value;
  }

  // Обработчик события pointerdown
  onPointerDown = (event) => {
    let slider = this.elem;
    let thumb = slider.querySelector('.slider__thumb');
    let progress = slider.querySelector('.slider__progress');

    slider.classList.add('slider_dragging');

    // Обработчик события pointermove    
    function onPointerMove(event) {
      let left = event.clientX - slider.getBoundingClientRect().left;
      let leftRelative = left / slider.offsetWidth;

      if(leftRelative < 0) {
        leftRelative = 0;
      }

      if(leftRelative > 1) {
        leftRelative = 1;
      }

      let leftPercents = leftRelative * 100;

      thumb.style.left = `${leftPercents}%`;
      progress.style.width = `${leftPercents}%`;
    };
    
    slider.addEventListener('pointermove', onPointerMove);

    // Обработчик события pointerup
    let onPointerUp = (event) => {
      slider.classList.remove('slider_dragging');

      slider.removeEventListener('pointermove', onPointerMove);
      thumb.removeEventListener('pointerup', onPointerUp);

      let currentValue = this.getClickValue(event.clientX);
      if(currentValue == this.value) {
        return;
      } else {
        this.value = currentValue;
  
        // Генерируем событие slider-change
        let sliderChangeEvent = new CustomEvent('slider-change', {
          detail: this.value,
          bubbles: true,
        });
        slider.dispatchEvent(sliderChangeEvent);
      }
    }

    thumb.addEventListener('pointerup', onPointerUp);
  }
}
