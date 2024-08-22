import React from 'react'; // { useState, SetStateAction }
import { add } from '@Services/fetches';
import { getCookie, checkCookieExists } from '@Services/coockieSessionId';
// Create the input filed by click's event
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
      (divHtml as HTMLElement).removeEventListener('keypress', handlerEnterofInput);
      (divHtml as HTMLElement).addEventListener('keypress', handlerEnterofInput);
    }, 300);
    return true;
  };
}

async function handlerEnterofInput(event: KeyboardEvent): Promise<boolean> {
  if (((event.key).toLowerCase() !== 'enter') ||
    ((event.target as HTMLElement).tagName.toLowerCase() !== 'input')) {
    return false;
  }

  const target = ((event).target as HTMLInputElement);
  /* ---- This's from the input fileld (that is new 'ads'-message ) ---- */
  const inputValue = target.value;
  const trueFalseSessionId = checkCookieExists('sessionId');
  if (!trueFalseSessionId) {
    throw new Error('[ads -> handlerEnterofInput]: Not  found. "sessionId" ');
  }
  const cookieSessionId = getCookie('sessionId');

  const pathnameStr = `/api/v1/clients/ads/${cookieSessionId}`;

  const body_ = JSON.stringify({
    inputValues: inputValue,
    cookie: { sessionId: cookieSessionId as string }
  });
  const result = await add(body_, pathnameStr);
  if (!result) {
    return false;
  }

  return true;
}


