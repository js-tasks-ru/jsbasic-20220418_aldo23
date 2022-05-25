function hideSelf() {
  let btns = document.querySelectorAll('button.hide-self-button');
  for(let btn of btns) {
    btn.addEventListener("click", function() {
      this.hidden = true;
    }, {once: true});
  }
}
