const promo__btn = document.querySelector('.promo__btn'),
      message = document.querySelector('.message'),
      message__windows = document.querySelectorAll('.message__window'),
      message__close = document.querySelectorAll('.message__close');

function visibleElement(i) {
    message.classList.remove('hidden');
    message.classList.add('visible');
    message__windows[i].classList.remove('hidden');
    message__windows[i].classList.add('visible');
}
function hiddenElement(i) {
    message.classList.remove('visible');
    message__windows[i].classList.remove('visible');
    message.classList.add('hidden');
    message__windows[i].classList.add('hidden');
}
promo__btn.addEventListener('click', ()=> {
    visibleElement(0);
});
message__close.forEach((mc, i) => {
    mc.addEventListener('click', () => {
        hiddenElement(i);
    });
});


