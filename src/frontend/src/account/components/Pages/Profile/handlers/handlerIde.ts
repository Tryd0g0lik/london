// import React from 'react';
import { FieldInnerHtml } from '@Interfaces';
import { add } from '@Services/fetches';
import { getCookie } from '@Services/coockieSessionId';
import { messageForUser } from '@Services/messengerForm';
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

  Array.from(nameHtmlArr).forEach((item) => {
    (item as HTMLDivElement).removeEventListener('click', helperForHandlerSwhitches());
    (item as HTMLDivElement).addEventListener('click', helperForHandlerSwhitches());
  });

  return true;
}


/**
 * Тут, больше вопрос безопасности.
 * @returns HTMLLableElement
 */
function basisRedactField(props: FieldInnerHtml): HTMLElement {
  const { dataNameX, text = '' } = props;
  const label = document.createElement('label');
  const input = document.createElement('input');


  label.htmlFor = "text";
  label.className = "input input-bordered flex items-center gap-2";
  input.setAttribute('namex', dataNameX);
  input.id = dataNameX;
  input.name = 'text';
  input.type = 'text';
  input.maxLength = 50;
  input.className = "grow";
  input.placeholder = "text";
  if (text.length > 0) {
    input.placeholder = text
  };
  label.appendChild(input)

  return label
}


/* --------------- The Function is for change the intarface's dashboard ------------------ */
const changeHtmlInner = (target: HTMLElement) => {
  const switchsCore = ((target).parentElement as HTMLDivElement);
  const ndArr = switchsCore.childNodes;
  // That is a filter for field in which has a content for change
  const displayedContentOfFieldArr = Array.from(ndArr).filter((item) => ((item as HTMLElement).className).length === 0);
  // That is a filter for fieled for changing of content
  const elementArr = Array.from(ndArr).filter((item) => (item as HTMLElement).className.includes('switchs-rewrite'))
  Array.from(elementArr).forEach((item, index) => {
    const currentHtml = (item as HTMLDivElement).innerHTML;
    if ((currentHtml === null) || ((typeof currentHtml === 'string') &&
      currentHtml.length === 0)) {
      // Here receive the content from the field;
      const contentOfFieldOld = (displayedContentOfFieldArr.length > 0) ?
        (displayedContentOfFieldArr[0] as HTMLElement).outerText : '';

      /* ------ Setimeout -------
      This's a place when we need to get an atribute 'data-namex' from
      parent html's tage */

      let atributeTimeout: ReturnType<typeof setTimeout> | null = null;

      const namexChecker = (item: HTMLElement): boolean => {

        clearTimeout(atributeTimeout!)
        const atribute = item.hasAttribute('data-namex');
        if (atribute) {
          // clearTimeout(atributeTimeout)
          // const dataName = item.getAttribute('namex');
          // if (typeof dataName !== 'string') {
          //   return false;
          // }
          // /* ------- endSetimeout ------ */
          // (elementArr[index] as HTMLDivElement).insertAdjacentElement('beforeend', basisRedactField({ dataNameX: dataName, text: contentOfFieldOld }) as unknown as HTMLElement);

          // // That is handler of keyboard-event from the Input's field.
          // const inputHtml = (elementArr[index] as HTMLElement).querySelector('.switchs-rewrite input');
          // if (inputHtml === null) {
          //   return false;
          // }
          // (inputHtml as HTMLElement).removeEventListener('keypress', handlerEventOfInput);
          // (inputHtml as HTMLElement).addEventListener('keypress', handlerEventOfInput);
        } else {
          // (atributeTimeout) = setTimeout(() => {
          //   item = item.parentElement as HTMLElement;
          //   namexChecker(item);
          // }, 100);
          (elementArr[index] as HTMLDivElement).innerHTML = '';
        }
        return true;
      }
      namexChecker(item as HTMLElement);
    }
    /* Then. this an atribute 'data-namex' us need  insert into
    the new html's  <input>-tage */


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
 * This is function for received data of an Input field. It sending \
 * POST-request into the server.
 * @param event
 * @returns fooald
 */
const handlerEventOfInput = async (event: KeyboardEvent): Promise<boolean> => {
  if (((event.key).toLowerCase() !== 'enter') ||
    ((event.currentTarget as HTMLElement).tagName.toLowerCase() !== 'input')) {
    return false;
  }
  const target = event.currentTarget as HTMLInputElement;
  const newValueOfInput = target.value;
  /* This is atribute 'data-namex' from the above. Received value of 'data-namex' */
  const atributeDataNameX = (target.hasAttribute('data-namex')) ? target.getAttribute('namex') : '';
  const body_ = JSON.stringify({
    typeField: atributeDataNameX,
    newValueofField: newValueOfInput
  })
  /* --------------- Here us a cookie is to get ------------------ */
  const sessionId = getCookie('sessionId');
  const p = messageForUser(0, ['Не сохранился', 'Сохранился'])
  const label = (target.parentElement as HTMLElement);
  if (sessionId === undefined) {
    /* here is a not found */
    label.insertAdjacentHTML('afterend', p.outerHTML);
    return false;
  }
  /* here is found */
  label.insertAdjacentHTML('afterend', p.outerHTML);
  await add(body_, 'api/v1/clients/:id')
  return true;
}
