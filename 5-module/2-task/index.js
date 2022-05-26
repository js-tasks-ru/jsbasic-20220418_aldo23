function toggleText() {
  let btns = document.querySelectorAll("button.toggle-text-button");
  for(let btn of btns) {
    btn.addEventListener('click', function() {
      text.hidden = !text.hidden;
    });
  }
}
