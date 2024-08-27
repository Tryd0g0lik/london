// import React from 'react';
import { FieldInnerHtml, Inpt } from '@Interfaces';
import { put, add } from '@Services/fetches';
import { messageForUser } from '@Services/messengerForm';
import { basisRedactField } from '@Services/fields';
import { getCookie } from '@Services/coockieSessionId';
import { Input } from './oop/inputForm';

/**
 * Страница "Профиль". Поля ФИО имет рубильник. Клик на рубильник - получаем сласс "active" на рубильнике-события
 *
 * @returns
 */
export async function handlerIdeFC(): Promise<boolean> {

  const switchs = document.querySelector('.profile.form');
  if (switchs === null) {
    return false;
  }

  const nameHtmlArr = switchs.querySelectorAll('.profile.form>div');
  if (nameHtmlArr.length === 0) {
    return false;
  }
  Array.from(nameHtmlArr).forEach((item, index) => {
    if (!item.hasAttribute('data-namex')) {
      (item as HTMLDivElement).removeEventListener('click', handlerButtonForFriends);
      (item as HTMLDivElement).addEventListener('click', handlerButtonForFriends);
      return false;
    }
    (item as HTMLDivElement).removeEventListener('click', helperForHandlerSwhitches());
    const clonedItem = item.cloneNode(true) as HTMLDivElement;
    clonedItem.addEventListener('click', helperForHandlerSwhitches());
    item.replaceWith(clonedItem);
  });

  return true;
}



/* --------------- The Function is for change the intarface's dashboard ------------------ */
const changeHtmlInner = (target: HTMLElement) => {
  const switchsCore = ((target).parentElement as HTMLDivElement);
  const ndArr = switchsCore.childNodes;
  // That is a filter for field in which has a content for change
  const displayedContentOfFieldArr = Array.from(ndArr).filter((item) => (item as HTMLElement).tagName.toLowerCase() === 'div' && ((item as HTMLElement).className).length === 0);
  // That is a filter for fieled for changing of content
  const elementArr = Array.from(ndArr).filter((item) => (item as HTMLElement).className.includes('switchs-rewrite'))
  Array.from(elementArr).forEach((item, index) => {
    const currentHtml = (item as HTMLDivElement).innerHTML;
    if ((currentHtml === null) || ((typeof currentHtml === 'string') &&
      currentHtml.length === 0)) {
      // Here receive the content old from the field;
      const contentOfFieldOld = (displayedContentOfFieldArr.length > 0) ?
        (displayedContentOfFieldArr[0] as HTMLElement).outerText : '';
      /* Then. this an atribute 'data-namex' us need  insert into
the new html's  <input>-tage */
      //'data-namex'

      let atributeTimeout: ReturnType<typeof setTimeout> | null = null;
      // sub-sub-function
      const namexChecker = (item: HTMLElement, fun: (props: FieldInnerHtml) => HTMLElement): boolean => {

        clearTimeout(atributeTimeout!);
        const atribute = item.hasAttribute('data-namex');
        if (atribute) {
          clearTimeout(atributeTimeout!)
          const dataName = item.getAttribute('data-namex');
          if (typeof dataName !== 'string') {
            return false;
          }
          /* ------- endSetimeout ------
          and then insert input's field */
          (elementArr[index] as HTMLDivElement).insertAdjacentElement('beforeend', fun({ dataNamex: dataName, text: contentOfFieldOld }) as unknown as HTMLElement);

          // // That is handler of keyboard-event from the Input's field.
          const inputHtml = (elementArr[index] as HTMLElement).querySelector('.switchs-rewrite input');
          if (inputHtml === null) {
            return false;
          }

          /* ------- subHelper - look the under this a code ------ */
          const subHelper = async (event: KeyboardEvent) => {
            if (((event.key).toLowerCase() !== 'enter') ||
              ((event.currentTarget as HTMLElement).tagName.toLowerCase() !== 'input')) {
              return false;
            }
            const inputObj = new Input({
              pathname: `/api/v1/clients/`, body: {} as Inpt['body']
            })
            inputObj.cookieSession = 'sessionId';
            const cookieValue = inputObj.cookieSession;
            const pathnames = inputObj.pathnames as string;
            const body_ = inputObj.body;
            handlerEventOfInputPUT({ pathname: pathnames, body: body_, sessionId: cookieValue })(event);
            // Input wich need the delete
            const target = (event.target as HTMLElement);
            if (target.tagName.toLowerCase() !== 'input') {
              throw new Error('[profile -> UI dashoard]: Something whtat wrong!')
            }
            // receives a new content
            const newContent = (target as HTMLInputElement).value;
            // Here we going to the above by DOM-tree. It to the container for input's field (for redact);
            let divHtml = (target.parentElement as HTMLLabelElement).parentElement;
            if (divHtml === null) {
              throw new Error('[profile -> UI dashoard2]: Something whtat wrong!')
            }
            divHtml.innerHTML = '';
            // Here we gor to the parent from switcher.
            if ((divHtml.parentElement as HTMLElement).hasAttribute('data-namex') === false) {
              throw new Error('[profile -> UI dashoard3]: Something whtat wrong!')
            }
            // Here we go to below by DOM-tree. It move to switcher
            const oldFieldOfClassName = (divHtml.parentElement as HTMLElement).querySelector('div>input[type="checkbox"]');
            if (!oldFieldOfClassName) {
              throw new Error('[profile -> UI dashoard]: Something whtat wrong!')
            }

            oldFieldOfClassName.className =
              oldFieldOfClassName.className.replace(' active ', ' ');
            (oldFieldOfClassName as HTMLElement).click()
            // Here a content is update
            divHtml = (divHtml.parentElement as HTMLElement).querySelector('div>div:first-of-type');
            if (!divHtml) {
              throw new Error('[profile -> UI dashoard]: Something whtat wrong!')
            }
            divHtml.innerHTML = newContent;

            handlerIdeFC();

          }
          // handler for sending request to the server
          (inputHtml as HTMLElement).removeEventListener('keypress', subHelper);
          (inputHtml as HTMLElement).addEventListener('keypress', subHelper);
          /* ------- endSubHelper ------ */
        } else {
          (atributeTimeout) = setTimeout(() => {
            item = item.parentElement as HTMLElement;
            namexChecker(item, basisRedactField);
          }, 100);

        }
        return true;
      }
      namexChecker(item as HTMLElement, basisRedactField);

    } else {
      (elementArr[index] as HTMLDivElement).innerHTML = '';
    }
  });
};

/**
 * This's only function.
 * @returns
 */
const helperForHandlerSwhitches = () => {
  let index = 0;
  /**
 * This's handler for an Event:EventMouse. We receving changes to the dashboard of interface.
 *
 * @returns
 */
  const handlerSwhitches = async (event: MouseEvent): Promise<boolean> => {

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
      /* --------------- Checnge the innerHTML ------------------ */
      changeHtmlInner(target as HTMLElement);

      index++;
    } else if (oldClassName.includes('active') && (index === 1)) {

      oldClassName.replace('activve', '');
      (mouseTarget as HTMLInputElement).className =
        (mouseTarget as HTMLInputElement).className.replace('active ', '');
      /* --------------- Checnge the innerHTML ------------------ */
      changeHtmlInner(target as HTMLElement);
      index -= 1;
      // убрали класс ACTIVE - выключили редактирование.
    }
    return true;
  }
  return handlerSwhitches;
}

/**
 * `Note: Recommended work with a class `Input` from \
 * the '`import { Input } from './oop/inputForm';`
 *
interface Inpt {
  pathname: string
  body: {
    typeField: string
    newValueofField: string
    indexMessege?: string
    indexEmail?: string
  } | string
  sessionId?: string
}
 * `
 * @param props it is type name 'Inpt
 * @returns `(event: KeyboardEvent) => Promise<boolean>`
 */
export function handlerEventOfInputPUT(props: Inpt): (event: KeyboardEvent) => Promise<boolean> {
  let { pathname, body, sessionId, } = props;
  return async (event: KeyboardEvent): Promise<boolean> => {

    const target = event.currentTarget as HTMLInputElement;
    /* The value from html-input field */
    const newValueOfInput = target.value;
    const bodyNew = body
    bodyNew.newValueofField = newValueOfInput;
    body = { ...bodyNew };
    /* This is atribute 'data-namex' from the above. Received value of 'data-namex' */
    const atributeDataNameX = (target.hasAttribute('data-namex')) ? target.getAttribute('data-namex') : '';
    body.typeField = atributeDataNameX as string;
    /* --------------- Here us a cookie is to get ------------------ */
    const label = (target.parentElement as HTMLElement);
    const path = `${pathname}${sessionId}`;
    const result = await put(JSON.stringify(body), path)
    if ((sessionId === undefined) || (result === false)) {
      const p = messageForUser(1, ['Сохранился', 'Не сохранился'])
      /* here is a not found */
      label.insertAdjacentHTML('afterend', p.outerHTML);
      return false;
    }
    return true;
  }
}

/* --------------- Below is a function/handler for button 'Добавить в друзья'   ------------------ */
async function handlerButtonForFriends(event: MouseEvent): Promise<boolean> {
  if ((((event).target as HTMLButtonElement).type) &&
    (((event).target as HTMLButtonElement).type).toLowerCase() !== 'submit' &&
    (((event).target as HTMLButtonElement).outerText) !== 'Добавить в друзья') {
    return false;
  }

  const sessionInd = getCookie('sessionId');
  const currentPathname = window.location.pathname;
  const regex = /^\d+$/;
  const arr = currentPathname.split('/');
  if ((arr.length === 0) ||
    !(regex.test(arr[arr.length - 1]))) {
    return false;
  }
  const cookie = {
    sessionId: sessionInd
  };
  const bodyStr = JSON.stringify({
    clieetnsId: arr[arr.length - 1],
    references: currentPathname,
    cookie
  });
  // отправляем в базу данных
  let responce = await add(bodyStr, `/api/v1/clients/${arr[arr.length - 1]}/${sessionInd}`) as { message: string, sessionId?: string };
  if (!responce) {
    console.error('[handlerButtonForFriends]: New friend not is added');
    return false;
  };
  return true;

}
