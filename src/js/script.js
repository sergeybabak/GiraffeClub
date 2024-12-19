const promo__btn = document.querySelector('.promo__btn'),
      message = document.querySelector('.message'),
      message__windows = document.querySelectorAll('.message__window'),
      message__close = document.querySelectorAll('.message__close'),
      form = document.querySelector('form');

function visibleElement(i) {
    displayElement();
    // noneElement(i);
    if (i==2) {
        message__windows[0].classList.add('none');
        message__windows[1].classList.add('none');
    }
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
    
    // displayElement(i);
}
function noneElement(i) {
    message__windows.forEach((mw, item) => {
        if (item!=i) {
            message__windows[item].classList.add('none');
        } 
    });
}
function displayElement() {
    message__windows.forEach((mw, item) => {
        message__windows.forEach((mw, item) => {
            message__windows[item].classList.remove('none');
        });
    });
}
promo__btn.addEventListener('click', ()=> {
    visibleElement(0);
});
message__close.forEach((mc, i) => {
    mc.addEventListener('click', () => {
        hiddenElement(i);
    });
});
form.addEventListener('submit', (event) => {
    event.preventDefault();
    hiddenElement(0);
    
    visibleElement(2);
});


