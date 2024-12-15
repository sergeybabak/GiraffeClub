const promo__btn = document.querySelector('.promo__btn'),
      message = document.querySelector('.message'),
      message__windows = document.querySelectorAll('.message__window'),
      message__close = document.querySelectorAll('.message__close'),
      consultation = document.querySelector('#consultation');

promo__btn.addEventListener('click', ()=> {
    message.classList.remove('hidden');
    message.classList.add('visible');
    consultation.classList.add('visible');
});
message__close.forEach(mc => {
    mc.addEventListener('click', () => {
        message__windows.forEach(mw => {
            // mw.classList.remove('visible');
            // mw.classList.add('hidden');
            if (message.classList.contains('visible')) {
                setTimeout(() => { 
                    mw.classList.remove('visible');
                    mw.classList.add('hidden');
                    message.classList.remove('visible');
                    message.classList.add('hidden');
                }, 1000);
            }
        })
    });
});
// close.addEventListener('click', ()=> {
//     menu.classList.remove('active');
// });

