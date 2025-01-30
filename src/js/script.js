const body = document.querySelector('body'),
      btn = document.querySelectorAll('.button'), // все кнопки
      message = document.querySelector('.message'), // основное окно (на весь экран) с всплывающим сообщением
      message__windows = document.querySelectorAll('.message__window'), // окна с всплывающими сообщениями (2 штуки)
      message__close = document.querySelectorAll('.message__close'), // крестик для закрытия всплывающего сообщения
      offers__item = document.querySelectorAll('.offers__item'), // пункты в блоке offers
      form = document.querySelector('form');

      // функция для запрета прокрутки окна
function preventScroll(e) {
    e.preventDefault();
}

// показывает одно из двух окон сообщений (0 - окно с формой, 1 - сообщение, что данные отосланы)
function visibleElement(i) {
    displayElement();
    if (i==1) message__windows[0].classList.add('none'); // если второе окно, то убираем первое
    // показываем общее затененное окно
    message.classList.remove('hidden');
    message.classList.add('visible');
    // добавляем нужный класс для появления сообщения
    message__windows[i].classList.remove('hidden');
    message__windows[i].classList.add('visible');
    // запрещаем прокрутку окна
    window.addEventListener('wheel', preventScroll, { passive: false });
}
// скрываем окно сообщения (pointer-events: none;)
function hiddenElement(i) {
    message.classList.remove('visible');
    message__windows[i].classList.remove('visible');
    message.classList.add('hidden');
    message__windows[i].classList.add('hidden');
    // разрешаем прокрутку окна
    window.removeEventListener('wheel', preventScroll, { passive: false });
}
// убираем окно сообщения (display: none)
function noneElement(i) {
    message__windows.forEach((mw, item) => {
        if (item!=i) {
            message__windows[item].classList.add('none');
        } 
    });
}
function displayElement() {
    message__windows.forEach((mw, item) => {
        message__windows[item].classList.remove('none');
    });
}
// отслеживаем нажатие любой кнопки
btn.forEach(i => {
    i.addEventListener('click', ()=> {
        if (i.innerText == 'Отримати консультацію') message__windows[0].querySelector('p').textContent = 'Отримай консультацію';
        else if (i.innerText == 'Залишити заявку') message__windows[0].querySelector('p').textContent = 'Залишити заявку';
        visibleElement(0);
        // body.classList.add('overflow');
    });
});
message__close.forEach((mc, i) => {
    mc.addEventListener('click', () => {
        hiddenElement(i);
        // body.classList.remove('overflow');
    });
});
form.addEventListener('submit', (event) => {
    event.preventDefault();
    hiddenElement(0);
    form.reset(); // очищаем форму при ее успешной отправке
    visibleElement(1);
});

// работа со списком в блоке offers
function clearClass() {
    offers__item.forEach(item => {
        if (item.classList.contains('white')) item.classList.remove('white');
    });
}

offers__item.forEach(item => {
    // наведение мышки на пункт
    item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('white')) {
            item.classList.add('grey');
        }
    });
    // уход мышки с пункта
    item.addEventListener('mouseleave', () => {
        item.classList.remove('grey');
    });
    // уход мышки с пункта
    item.addEventListener('click', () => {
        clearClass();
        item.classList.remove('grey');
        item.classList.add('white');
    });
});

const hamburger = document.querySelector('.hamburger'),
      menu = document.querySelector('.header__menu')
    //   , headerTitle = document.querySelector('.header__title')
;

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('hamburger__active');
    menu.classList.toggle('header__menu-active');
    // headerTitle.style.display = 'inherit';
    if (hamburger.classList.contains('hamburger__active')) window.addEventListener('wheel', preventScroll, { passive: false })
    else window.removeEventListener('wheel', preventScroll, { passive: false });
});


