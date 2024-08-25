import React, { KeyboardEvent } from 'react'; // { useState, SetStateAction }
import { get } from '@Services/fetches';
import { getCookie, checkCookieExists } from '@Services/coockieSessionId';
import { messageForUser } from '@Services/messengerForm';
import { createDivLableContainer } from '@Services/fields';

import { OneLine, Ads } from '@Interfaces';

export async function loaderProfilesAll(): Promise<boolean> {
  const divHtml = document.querySelector('.list-profiles');
  if (divHtml === null) {
    throw new Error('[ads -> loaderContents]: Not found. "div.list-ads"');
  }
  const trueFalseSessionId = checkCookieExists('sessionId');
  let sessionId = '0';
  if (trueFalseSessionId) {
    sessionId = getCookie('sessionId') as string;
  }

  const pathnameStr = `/api/v1/clients/profiles/all/${sessionId}`;
  const body_ = JSON.stringify({});
  const result = await get(body_, pathnameStr) as unknown as Ads;
  if (typeof result === 'boolean' || !(result.positions)) {
    const p = messageForUser(1, ['Загрузился', 'Не загрузился']);
    (divHtml as HTMLElement).insertAdjacentHTML('afterbegin', p.outerHTML);
    throw new Error('[ads -> handlerEnterofInput]: Not loaded. "GET" ');
  }
  return true;
}
