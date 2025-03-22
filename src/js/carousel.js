export default class Carousel {
    constructor(container, left_controls, right_control) {
        this.container = container;                                         // сохраняем класс контейнера
        this.carouselContainer = document.querySelector(container);         // объект контейнер
        if (!this.carouselContainer) {                                      // Проверяем, найден ли элемент
            console.warn(`⚠️ Ошибка: Элемент с селектором "${container}" не найден! Карусель не создана!`);
            return;
        }
        this.countItems = this.carouselContainer.childElementCount;         // количество элементов карусели

        this.gap = 40;                                                      // отступ между элементами карусели (если нет в стилях, а нужно)
        this.itemWidth;                                                     // ширина элемента карусели, взятая по первому элементу
        this.positionArray = [];                                            // массив позицие left элементов карусели (не изменяется в процессе работы)
        this.itemsMerged = false;                                           // флаг объединения стилей в один (item-N)

        this.leftControl = document.querySelector(left_controls);           // элемент управления (по заданному идентификатору) для движения карусели влево
        this.rigthControl = document.querySelector(right_control);          // элемент управления (по заданному идентификатору) для движения карусели вправо
        this.autoWidth = false;                                             // масштабировать ли элементы карусели к обертке

        this.setControl();                                                  // функция назаначает события нажатия на элементы управления (влево/вправо)

        this.initPosition();                                                // Инициализация всех позиций элементов карусели (для вызова при изменении размеров окна)
    }
    
    initPosition() {
        const itemAspectRatio = this.carouselContainer.firstElementChild.offsetHeight / this.carouselContainer.firstElementChild.offsetWidth;

        this.gap = parseInt(window.getComputedStyle(this.carouselContainer).getPropertyValue('gap')) || this.gap;

        const central = Math.round(this.carouselContainer.offsetWidth / 2);
        if (this.autoWidth) Math.round(this.itemWidth = (this.carouselContainer.offsetWidth - this.gap * 2) / 3 - 1)
        else this.itemWidth = this.carouselContainer.firstElementChild.offsetWidth;
        const leftCentral = central - Math.round(this.itemWidth / 2); // Центрируем centralItem
        const centralItem = 2;

        Array.from(this.carouselContainer.children).forEach((item, index) => {
            if (!this.itemsMerged) {
                this.mergeStyles(item, `item-${index + 1}`);
                this.addOrUpdateRule(`item-${index + 1}`, 'position', 'absolute');
            };
            if (this.getStyleValue(`item-${index + 1}`, 'max-width') != this.itemWidth) { 
                this.addOrUpdateRule(`item-${index + 1}`, 'max-width', this.itemWidth + 'px');
                this.addOrUpdateRule(`item-${index + 1}`, 'max-height', this.itemWidth * itemAspectRatio + 'px');
            }
            this.positionArray[index] = leftCentral + (index + 1 - centralItem) * (this.itemWidth + this.gap);
            if (this.autoWidth) {
                this.addOrUpdateRule(`item-${index + 1}`, 'width', this.itemWidth + 'px');
                this.addOrUpdateRule(`item-${index + 1}`, 'height', this.itemWidth / itemAspectRatio + 'px');
            }
            this.addOrUpdateRule(`item-${index + 1}`, 'left', this.positionArray[index] + 'px');
        });
        this.itemsMerged = true;
    }

    // берем все классы для div-элемента карусели и на их основании создаем новый класс - item-n (n - номер по порядку)    
    // это делается для того, чтобы основной элемент отличался от других (в данном случае был больше)
    mergeStyles(element, newClass) {
        let classList = [...element.classList]; // Получаем список классов
        let mergedStyles = "";

        // Проходим по таблицам стилей
        for (let sheet of document.styleSheets) {
            try {
                for (let rule of sheet.cssRules) {
                    if (!rule.selectorText) continue;

                    classList.forEach(className => {
                        // Строго проверяем соответствие класса
                        const selector = `.${className}`;
                        if (rule.selectorText === selector || rule.selectorText.includes(`${selector},`) || rule.selectorText.includes(` ${selector}`)) {
                            // if (rule.style.cssText.includes('left') )console.log(rule.style.cssText);
                            mergedStyles += rule.style.cssText + " ";
                        }
                    });
                }
            } catch (e) {
                console.warn("Ошибка чтения стилей из таблицы", e);
            }
        }

        // Добавляем новый класс в первую таблицу стилей
        if (document.styleSheets.length > 0 && mergedStyles.trim() !== "") {
            document.styleSheets[0].insertRule(`.${newClass} { ${mergedStyles} }`, document.styleSheets[0].cssRules.length);
        }

        // Удаляем старые классы и добавляем новый
        element.className = ""; 
        element.classList.add(newClass);
    }

    // добавляет стиль в нужный класс или заменяет его значение если он есть (например: left: 100px)
    addOrUpdateRule(className, property, value) {
        let ruleFound = false; // Флаг, нашли ли мы нужное правило
    
        for (let sheet of document.styleSheets) { // Перебираем все таблицы стилей
            try {
                for (let rule of sheet.cssRules) { // Перебираем все CSS-правила внутри таблицы
                    if (rule.selectorText === `.${className}`) { // Если нашли нужный класс
                        rule.style[property] = value; // Изменяем указанное свойство
                        ruleFound = true; // Устанавливаем флаг, что правило найдено
                        break; // Прекращаем перебор, так как нашли нужное правило
                    }
                }
            } catch (e) {
                console.warn("Ошибка при обновлении стиля", e); // Ловим ошибки при доступе к таблице стилей
            }
        }
    
        // Если правило не найдено, добавляем его в первую доступную таблицу стилей
        if (!ruleFound && document.styleSheets.length > 0) {
            document.styleSheets[0].insertRule(
                `.${className} { ${property}: ${value}; }`,  // Создаём новое CSS-правило
                document.styleSheets[0].cssRules.length      // Вставляем в конец таблицы
            );
        }
    }

    // возвращает значение свойства из нужного класса (в примере про left вернет 100рх)
    getStyleValue(className, property) {
        for (let sheet of document.styleSheets) { // Перебираем все таблицы стилей
            try {
                for (let rule of sheet.cssRules) { // Перебираем все CSS-правила
                    if (rule.selectorText === `.${className}`) { // Если нашли нужный класс
                        return rule.style[property] || null; // Возвращаем значение свойства или null
                    }
                }
            } catch (e) {
                console.warn("Ошибка при получении стиля", e); // Обрабатываем ошибки доступа
            }
        }
        return null; // Если стиль не найден
    }
    
    // копирование класса
    copyClass(oldClass, newClass) {
        for (let sheet of document.styleSheets) {
            try {
                for (let rule of sheet.cssRules) {
                    if (rule.selectorText === `.${oldClass}`) {
                        let newRule = `.${newClass} { ${rule.style.cssText} }`;
                        sheet.insertRule(newRule, sheet.cssRules.length);
                        return;
                    }
                }
            } catch (e) {
                console.warn("Ошибка при копировании стилей", e);
            }
        }
    }

    // удаление класса
    removeClass(className) {
        for (let sheet of document.styleSheets) {
            try {
                for (let i = 0; i < sheet.cssRules.length; i++) {
                    if (sheet.cssRules[i].selectorText === `.${className}`) {
                        sheet.deleteRule(i);
                        return;
                    }
                }
            } catch (e) {
                console.warn("Ошибка при удалении стиля", e);
            }
        }
    }

    moveItems(direction) {
        let firstElement = this.carouselContainer.firstElementChild; // Первый элемент
        let lastElement = this.carouselContainer.lastElementChild; // Последний элемент
        let shift = this.itemWidth + this.gap; // Сдвиг (ширина + gap)

        if (direction === 'left') {
            // let firstElement = this.carouselContainer.firstElementChild;
            const clonedElement = firstElement.cloneNode(true); // Клонируем первый элемент
            clonedElement.className = 'item-5';
            this.carouselContainer.appendChild(clonedElement); // Добавляем копию в конец
            this.copyClass('item-1', 'item-0');

            // 1️⃣ Сдвигаем все элементы влево
            Array.from(this.carouselContainer.children).forEach((item, i) => {
                item.className = `item-${i}`;
                let newLeft = this.positionArray[i] - shift; // Вычисляем новое положение
                this.addOrUpdateRule(`item-${i}`, 'left', `${newLeft}px`);
            });
            
            setTimeout(() => {
                this.carouselContainer.removeChild(this.carouselContainer.firstElementChild);
                this.removeClass('item-0');
                
                this.carouselItems = this.carouselContainer.querySelectorAll(':scope > div'); // Обновляем NodeList
                this.carouselArray = [...this.carouselItems]; // Обновляем массив
            }, 300);
        } else if (direction == 'right') {
            // 2️⃣ Вычисляем новую позицию (левее первого элемента)
            // let lastElement = this.carouselContainer.lastElementChild;
            let newLeft = this.positionArray[0] - shift;
            const clonedElement = lastElement.cloneNode(true); // Клонируем последний элемент

            // 3️⃣ Задаем классу новый left перед тем, как изменять DOM
            this.addOrUpdateRule(clonedElement.className, 'left', `${newLeft}px`);

            setTimeout(() => {
                Array.from(this.carouselContainer.children).forEach((item, i) => {
                    this.addOrUpdateRule(`item-${i + 1}`, 'left', this.positionArray[i] + 'px');
                    item.className = `item-${i + 1}`;
                });
            });
            this.carouselContainer.insertBefore(lastElement, this.carouselContainer.firstChild);
        }   
    };

    setControl() {
        this.leftControl.addEventListener('click', () => { this.moveItems('left'); });
        this.rigthControl.addEventListener('click', () => { this.moveItems('right'); });
    };

    // метод для изменения какого-либо значения в конструкторе извне (например gap)
    updateSettings(newSettings) {
        Object.keys(newSettings).forEach(key => {
            if (this.hasOwnProperty(key)) { // Проверяем, существует ли свойство в объекте
                this[key] = newSettings[key];
            }
        });
    
        this.initPosition(); // Пересчитываем позиции после обновления параметров
    }
}

// запуск карусели из основного script.js
/* import Carousel from "./carousel.js";

document.addEventListener('DOMContentLoaded', () => {
    const exampleCarousel = new Carousel('.gallery-container', '.arrow_left', '.arrow_rigth');
    window.addEventListener("resize", () => exampleCarousel.initPosition());
}); */

// Пример динамического обновления gap и т.п.
/* setTimeout(() => {
    exampleCarousel.updateSettings({ 
        gap: 50, 
        autoWidth: true,
        itemWidth: 300 
    });
}, 2000); // Через 2 секунды изменятся параметры и обновится карусель */