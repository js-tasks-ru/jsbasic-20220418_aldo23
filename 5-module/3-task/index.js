function initCarousel() {
  let carousel = document.querySelector('.carousel'),
      carouselInner = document.querySelector('.carousel__inner'),
      slidesQuality = document.querySelectorAll('.carousel__slide').length,
      arrowLeft = document.querySelector('.carousel__arrow_left'),
      arrowRight = document.querySelector('.carousel__arrow_right'),
      currentSlide = 1,
      nextPosition = 0;

  arrowLeft.style.display = 'none';

  carousel.addEventListener('click', function(event) {
    arrow = event.target.closest('.carousel__arrow');

    if(!arrow) return;

    if(arrow.classList.contains('carousel__arrow_right')) {
      currentSlide++;
      nextPosition += carouselInner.offsetWidth;
      carouselInner.style.transform = `translateX(-${nextPosition}px)`;
    } else {
      currentSlide--;
      nextPosition -= carouselInner.offsetWidth;
      carouselInner.style.transform = `translateX(-${nextPosition}px)`;
    }

    switch(currentSlide) {
      case 1:
        arrowLeft.style.display = 'none';
        break;
      case slidesQuality:
        arrowRight.style.display = 'none';
        break;
      default:
        arrowLeft.style.display = '';
        arrowRight.style.display = '';
    }
  });
}
