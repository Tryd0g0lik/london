import React from 'react'; // { useState, SetStateAction }
import { add } from '@Services/fetches';
import { getCookie, checkCookieExists } from '@Services/coockieSessionId';
let env_ = process.env.REACT_APP_POSTGRES_HOST;
const HOST = (env_ === undefined) ? 'localhost' : env_.slice(0) as string;
env_ = process.env.REACT_APP_SERVER_PORT;
const PORT = (env_ === undefined) ? '7070' : env_.slice(0);
env_ = process.env.REACT_APP_PROTOCOL_OF_URL;
const PROTOCOL = (env_ === undefined) ? 'http' : env_.slice(0);
env_ = undefined;
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
    (divHtml as HTMLElement).removeEventListener('keypress', handlerEnterofInput);
    (divHtml as HTMLElement).addEventListener('keypress', handlerEnterofInput);
    return true;
  };
}

async function handlerEnterofInput(event: KeyboardEvent): Promise<boolean> {
  if ((((event).target as HTMLInputElement).type) &&
    (((((event).target as HTMLInputElement).type).toLowerCase() !== 'imput') ||
      !((event).target as HTMLInputElement).hasAttribute('data-namex'))) {
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
  const urlStr = `${PROTOCOL}://${HOST}:${PORT}`;
  const url = urlStr + pathnameStr;
  const body_ = JSON.stringify({
    inputValues: inputValue,
    sessionId: cookieSessionId as string
  });
  const result = await add(body_, url);
  if (!result) {
    return false;
  }

  return true;
}


