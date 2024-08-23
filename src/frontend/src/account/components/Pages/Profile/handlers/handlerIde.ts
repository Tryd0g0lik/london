// import React from 'react';
import { FieldInnerHtml } from '@Interfaces';
import { put } from '@Services/fetches';
import { getCookie } from '@Services/coockieSessionId';
import { messageForUser } from '@Services/messengerForm';
import { basisRedactField } from '@Services/fields';
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

            await handlerEventOfInput(`/api/v1/clients/`);
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
    /* ------ Setimeout -------
    This's a place when we need to get an atribute 'data-namex' from
    parent html's tage */




    // namexChecker(item as HTMLElement);
    // }



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

interface Inpt {
  pathname: string
  body: {
    typeField: string
    newValueofField: string
    indexMessege?: string
    indexEmail?: string
  }
}
/**
 * This is function for received data of an Input field. It sending \
 * POST-request into the server.
 * @param event
 * @returns fooald
 */
// class Input {
//   pathnames: string

//   body: Inpt['body']

//   cookieKeyName: unknown | string


//   constructor(props: Inpt) {
//     const { pathname, body } = props;
//     this.pathnames = pathname;
//     this.body = body
//     this.cookieKeyName = ''
//   }

//   /**
//    * Here is only a single string/line/row  for entrypoint \
//    * It's a name of cookie-key.
//    * @param `object.cookieSession = mane`
//    */
//   set cookieSession(param: string) {
//     const trueFalse = getCookie(param);
//     if (trueFalse) {
//       this.cookieKeyName = param
//     }

//   }
//   /**
//    *
//    * Returns a value of cookie-key.
//    * @param `object.cookieSession = mane`
//    * @returns Here is only a single string
//    */
//   get cookieSession(): string {
//     const cookieKeyNames = this.cookieKeyName as string;
//     if (cookieKeyNames.length > 0) {
//       const value = getCookie(cookieKeyNames as string);
//       return value as string;
//     }
//     return '';
//   }


// }
export function handlerEventOfInput(pathname: string): (event: KeyboardEvent) => Promise<boolean> {
  return async (event: KeyboardEvent): Promise<boolean> => {

    const target = event.currentTarget as HTMLInputElement;
    const newValueOfInput = target.value;
    /* This is atribute 'data-namex' from the above. Received value of 'data-namex' */
    const atributeDataNameX = (target.hasAttribute('data-namex')) ? target.getAttribute('data-namex') : '';
    const body_ = JSON.stringify({
      typeField: atributeDataNameX as string,
      newValueofField: newValueOfInput
    })
    /* --------------- Here us a cookie is to get ------------------ */
    const sessionId = getCookie('sessionId');

    const label = (target.parentElement as HTMLElement);
    const result = await put(body_, `${pathname}${sessionId}`)
    if ((sessionId === undefined) || (result === false)) {
      const p = messageForUser(1, ['Сохранился', 'Не сохранился'])
      /* here is a not found */
      label.insertAdjacentHTML('afterend', p.outerHTML);
      return false;
    }

    /* here is found */
    const p = messageForUser(0, ['Сохранился', 'Не сохранился'])
    label.insertAdjacentHTML('afterend', p.outerHTML);


    return true;
  }
}
