import React, { KeyboardEvent } from 'react'; // { useState, SetStateAction }
import { add, get } from '@Services/fetches';
import { getCookie, checkCookieExists } from '@Services/coockieSessionId';
import { messageForUser } from '@Services/messengerForm';
import { handlerEventOfInputPUT } from '../../handlers/handlerIde';
import { Input } from '../../handlers/oop/inputForm';
import { Inpt } from '@Interfaces';
// Create the input filed by click's event
interface OneLine {
  titles?: string
  id: number
  email_id: number
}
interface Rows {
  rows: OneLine[]
}

interface Ads extends Rows {
  message: string
  positions?: OneLine[]
  position?: OneLine
}


/**
 *
 * @param elemHtml That is a HTML-element  for public/ It'is when we get an click's event.
 * @returns
 */
export function handlerAdsFC(elemHtml: HTMLLabelElement): (event: React.MouseEvent) => Promise<boolean> {


  return async (event: React.MouseEvent): Promise<boolean> => {
    if ((((event).target as HTMLButtonElement).type) &&
      (((event).target as HTMLButtonElement).type).toLowerCase() !== 'submit') {
      return false;
    }
    if (!(((event.target as HTMLButtonElement).parentElement as HTMLElement).parentElement as HTMLElement).hasAttribute('data-namex')) {
      return false;
    }

    const divRootHtml = (((event.currentTarget as HTMLButtonElement).parentElement as HTMLElement));

    // const numb = quantity + 1;
    // usestate(numb)

    /* ---- here we look up  input field ---- */
    const divHtml = divRootHtml.querySelector('section[data-namex="ads"] + div');
    if (divHtml === null) {
      throw new Error('[ads -> handlerAdsFC]: Not  found. "form-ads" ');
    }
    (divHtml as HTMLElement).insertAdjacentHTML('afterbegin', elemHtml.outerHTML);
    // const result = await add()
    setTimeout(() => {
      //@ts-ignore
      (divHtml as HTMLElement).removeEventListener('keypress', handlerEnterofInput);
      // @ts-ignore
      (divHtml as HTMLElement).addEventListener('keypress', handlerEnterofInput);
    }, 300);
    return true;
  };
}

/***
 * for publication the new line/massage/content.
 */
async function handlerEnterofInput(event: KeyboardEvent): Promise<boolean> {
  if (((event.key).toLowerCase() !== 'enter') ||
    ((event.target as HTMLElement).tagName.toLowerCase() !== 'input')) {
    return false;
  }

  const target = ((event).target as HTMLInputElement);
  /* ---- This's receive the message from the input fileld (that is new 'ads'-message ).
   It's saving in the db ---- */
  const inputValue = target.value;
  const trueFalseSessionId = checkCookieExists('sessionId');
  if (!trueFalseSessionId) {
    throw new Error('[ads -> handlerEnterofInput]: Not  found. "sessionId" ');
  }
  const cookieSessionId = getCookie('sessionId');

  const pathnameStr = `/api/v1/clients/ads/add/${cookieSessionId}`;

  const body_ = JSON.stringify({
    inputValues: inputValue,
    cookie: { sessionId: cookieSessionId as string }
  });
  const result = await add(body_, pathnameStr) as Ads;
  let divLable = (target.parentElement as HTMLLabelElement);
  if (typeof result === 'boolean' || !((result).position)) {
    const p = messageForUser(1, ['Сохранился', 'Не сохранился']);
    (divLable.parentElement as HTMLElement).insertAdjacentHTML('beforeend', p.outerHTML);
    return false;
  }
  /* ---- endSaving ---- */
  /* ---- Here delete the input field and public the new line, below ---- */

  const oneLine = (result as Ads).position;
  const divHtml = createDivLableContainer({ titles: (oneLine as OneLine).titles, id: (oneLine as OneLine).id, email_id: (oneLine as OneLine).email_id as number });

  const divClassListAds = (divLable.parentElement); //?.cloneNode(true);
  divLable.remove();
  (divClassListAds as HTMLElement).insertAdjacentHTML('beforeend', divHtml.outerHTML);
  /* ---- endDeletePublic ---- */

  return true;
}

/**
 * 'data-numberx' = this is the message id of db; \
 * 'data-userx' = this is the email id of db; \
 * @param props
 * @returns
 */
function createDivLableContainer(props: OneLine): HTMLElement {
  const {
    id,
    titles,
    email_id
  } = props;
  const divHtml = document.createElement('div');
  const p_ = document.createElement('p');
  p_.innerText = titles as string;
  divHtml.appendChild(p_);
  divHtml.setAttribute('data-numberx', String(id));
  divHtml.setAttribute('data-userx', String(email_id));
  const bottonHml = document.createElement('button');
  bottonHml.innerText = 'Редактировать';
  const divHtml2 = document.createElement('div');
  divHtml2.appendChild(bottonHml);
  divHtml.innerHTML += divHtml2.outerHTML;

  return divHtml
}

/**
 * Here is we download all positions from the db
 */
export async function loaderContents(elemLabelHtml: HTMLLabelElement): Promise<void> {
  const divHtml = document.querySelector('.profile.form.list-ads');
  if (divHtml === null) {
    throw new Error('[ads -> loaderContents]: Not found. "div.list-ads"');
  }
  const trueFalseSessionId = checkCookieExists('sessionId');
  if (!trueFalseSessionId) {
    throw new Error('[ads -> handlerEnterofInput]: Not  found. "sessionId" ');
  }

  const cookieSessionId = getCookie('sessionId');

  const pathnameStr = `/api/v1/clients/ads/all/${cookieSessionId}`;
  const body_ = JSON.stringify({});
  const result = await get(body_, pathnameStr) as unknown as Ads;
  if (typeof result === 'boolean' || !(result.positions)) {
    const p = messageForUser(1, ['Загрузился', 'Не загрузился']);
    (divHtml as HTMLElement).insertAdjacentHTML('afterbegin', p.outerHTML);
    throw new Error('[ads -> handlerEnterofInput]: Not loaded. "GET" ');
  }
  const positions = result.positions;
  /*
  interface OneLine {
    titles?: string
    id: number
    email_id: number
  }
  interface Rows {
    rows: OneLine[]
  }

  interface Ads extends Rows {
    message: string
    positions?: OneLine[]
    position?: OneLine
  }
    Here we creating a message's list. It is message we resived from db,  for only single user
  */
  for (let i = 0; i < positions.length; i++) {
    const {
      titles,
      id,
      email_id
    } = positions[i] as OneLine;
    const divHtmlMessage = createDivLableContainer({
      titles: titles,
      id: id,
      email_id: email_id
    });

    (divHtml as HTMLElement).insertAdjacentElement('beforeend', divHtmlMessage);
  };
  if (divHtml === null) {
    throw new Error('[profile -> ads -> handlerClickOfButton]: Something whtat wrong! ".profile.form.list-ads"');
  };

  (divHtml as HTMLDivElement).removeEventListener('click', (event: MouseEventInit) => handlerClickOfButton(elemLabelHtml)(event as MouseEvent));
  (divHtml as HTMLDivElement).addEventListener('click', (event: MouseEventInit) => handlerClickOfButton(elemLabelHtml)(event as MouseEvent));
}

/**
 * This is the listener of button for redact/re-write the message (only one position/message).
 * @param event : MouseEvent.
 * @returns boolean
 */
export function handlerClickOfButton(elemLabelHtml: HTMLLabelElement): (event: MouseEvent) => Promise<boolean> {

  return async (event: MouseEvent): Promise<boolean> => {
    if (((event.target as HTMLElement).tagName.toLowerCase() !== 'button') ||
      ((event.target as HTMLElement).outerText.toLowerCase() !== 'редактировать')) {
      return false;
    }
    const buttonHtml = (event.target as HTMLElement);
    const parantDivHtml = (buttonHtml.parentElement as HTMLDivElement).parentElement as HTMLDivElement;

    // Here is get the old text
    if (!(parantDivHtml.hasAttribute('data-numberx')) || !(parantDivHtml.hasAttribute('data-userx'))) {
      throw new Error('[ads -> handlerClickOfButton]: Not  found. "data-numberx" ');
    }
    const indexOneEmail = parantDivHtml.getAttribute('data-userx');
    const indexOneMessege = parantDivHtml.getAttribute('data-numberx');
    const oldMessage = parantDivHtml.querySelector('p');
    if (oldMessage === null) {
      return false;
    }
    // Here is insert to the input field and removing the html-tag name 'p';
    (elemLabelHtml.querySelector('input') as HTMLInputElement).placeholder = `${oldMessage.outerText}`;
    (buttonHtml.parentElement as HTMLDivElement).insertAdjacentHTML('afterbegin', elemLabelHtml.outerHTML);

    buttonHtml.innerText = '';

    (oldMessage as HTMLElement).remove();
    setTimeout(() => {
      const parentDivinputHtml = document.querySelector('.profile.form.list-ads');
      if (parentDivinputHtml === null) {
        throw new Error('[ads -> loaderContents]: Not found. "div.list-ads"');
      }

    // @ts-ignore
      (parentDivinputHtml as HTMLElement).removeEventListener('keypress', (event: KeyboardEvent) => {
        if ((((event as KeyboardEvent).key).toLowerCase() !== 'enter')) {
          return false;
        }
        const target = event.target as HTMLInputElement;
        console.log('TEST => subHandlerEventOfEnter')
        subHandlerEventOfEnter({
          titles: target.value as string,
          indexMessege: indexOneMessege as string
        })(event as KeyboardEvent)
      });
    // @ts-ignore
      (parentDivinputHtml as HTMLElement).addEventListener('keypress', (event: KeyboardEvent) => {
        if ((((event as KeyboardEvent).key).toLowerCase() !== 'enter')) {
          return false;
        }
        const target = event.target as HTMLInputElement;
        console.log('TEST2 => subHandlerEventOfEnter')
        subHandlerEventOfEnter({
          titles: target.value as string,
          indexMessege: indexOneMessege as string
        })(event as KeyboardEvent)
      });
    }, 1000);

    return true;
  }
}

interface SubHand {
  titles: string
  indexMessege: string
}
function subHandlerEventOfEnter(props: SubHand): (event: KeyboardEvent) => Promise<boolean> {
  const {
    titles,
    indexMessege
  } = props;

  return async (event: KeyboardEvent): Promise<boolean> => {


    /* Here  is  `pathname`. With It the 'sessionId' will be add inside of function name 'handlerEventOfInputPUT'. */
    const props = {
      pathname: `/api/v1/clients/ads/one/`,
      body: {
        titles: titles,
        indexMesseges: indexMessege
      }
    } as Inpt;
    const inputObj = new Input(props);
    /* this 'cookieSession' it will be added to the URL in end. */
    inputObj.cookieSession = 'sessionId';
    const cookieValue = inputObj.cookieSession;
    // @ts-ignore
    handlerEventOfInputPUT({ pathname: inputObj.pathnames, body: inputObj.body, sessionId: cookieValue })(event as KeyboardEvent);
    return true;
  }
}
