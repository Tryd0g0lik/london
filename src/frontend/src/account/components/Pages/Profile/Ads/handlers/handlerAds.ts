import React, { KeyboardEvent } from 'react'; // { useState, SetStateAction }
import { add } from '@Services/fetches';
import { getCookie, checkCookieExists } from '@Services/coockieSessionId';
import { messageForUser } from '@Services/messengerForm';
import { createDivLableContainer } from '@Services/fields';

import { OneLine, Ads } from '@Interfaces';


// Create the input filed by click's event


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
 * ДОБАВИТЬ
 */
async function handlerEnterofInput(event: KeyboardEvent): Promise<boolean> {
  if (((event.key) && (event.key).toLowerCase() !== 'enter') ||
    ((event.target as HTMLElement).tagName.toLowerCase() !== 'input') ||
    ((event.target as HTMLElement).hasAttribute('data-current') &&
      (event.target as HTMLElement).getAttribute('data-current') !== 'create')) {
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
  if (divClassListAds === null) return false;
  (divClassListAds as HTMLElement).insertAdjacentHTML('beforeend', divHtml.outerHTML);
  /* ---- endDeletePublic ---- */

  return true;
}

