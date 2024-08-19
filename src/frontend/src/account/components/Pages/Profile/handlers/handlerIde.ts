// import React from 'react';
/**
 * Страница "Профиль". Поля ФИО имет рубильник. Кдик на рубильник - получаем сласс "active" на рубильнике-события
 *
 * @returns
 */
export async function handlerIdeFC(): Promise<boolean> {

  const switchs = document.querySelector('.profil.form');
  if (switchs === null) {
    return false;
  }
  let index = 0;
  (switchs as HTMLDivElement).addEventListener('click', async (event: MouseEvent): Promise<boolean> => {

    const target = event.target;

    if ((event.type) && ((event.type).toLowerCase() !== 'click')) {
      return false;
    }

    let mouseTarget = event.target;
    if (((mouseTarget as HTMLInputElement).tagName).toLowerCase() !== 'input') {
      return false;
    }
    const oldClassName = (mouseTarget as HTMLInputElement).className;

    if (index === 0) {
      (mouseTarget as HTMLInputElement).className =
        (mouseTarget as HTMLInputElement).className.replace(' ', ' active ');
      index++;
    } else if (oldClassName.includes('active') && (index === 1)) {

      oldClassName.replace('activve', '');
      (mouseTarget as HTMLInputElement).className =
        (mouseTarget as HTMLInputElement).className.replace('active ', '');
      index -= 1;
      // убрали класс ACTIVE - выключили редактирование.
    }
    return true;
  });
  return true;
}
