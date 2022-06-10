import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.elem = this.render();
    this.elem.addEventListener('click', this.onClick);
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

    // Возвращаем slider
    return createElement(`
      <div class="slider">
        <div class="slider__thumb" style="left: ${sliderPercents}%;">
          <span class="slider__value">${this.value}</span>
        </div>
        <div class="slider__progress" style="width: ${sliderPercents}%;"></div>
        ${sliderSteps.outerHTML}
      </div>
    `);
  }

  // Обработчик клика на slider
  onClick = (event) => {
    let clickValue = this.getClickValue(event.clientX);
    
    if(this.value == clickValue) {
      return;
    } else {
      this.value = clickValue;
    }

    let thumb = this.elem.querySelector('.slider__thumb');
    let progress = this.elem.querySelector('.slider__progress');
    let slides = this.elem.querySelector('.slider__steps').children;

    let segments = this.steps - 1;
    let sliderPercents = this.value / segments * 100;

    // Новое значение в slider__value
    thumb.firstElementChild.innerHTML = this.value;

    // Меняем положение ползунка
    thumb.style.left = `${sliderPercents}%`;
    progress.style.width = `${sliderPercents}%`;

    // Выделяем шаг на слайдере
    for(let slide of slides) {
      slide.classList.remove('slider__step-active');
    }
    slides[this.value].classList.add('slider__step-active');

    // Генерируем событие slider-change
    let sliderChangeEvent = new CustomEvent('slider-change', {
      detail:this.value,
      bubbles: true,
    });

    this.elem.dispatchEvent(sliderChangeEvent);
  }

  // Возвращает номер шага
  getClickValue(clientX) {
    let left = clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;

    let segments = this.steps - 1;

    let value = Math.round(leftRelative * segments);

    return value;
  }
}
