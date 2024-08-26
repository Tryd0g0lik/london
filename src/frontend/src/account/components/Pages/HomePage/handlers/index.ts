import { get } from '@Services/fetches';
import { getCookie, checkCookieExists } from '@Services/coockieSessionId';
import { messageForUser } from '@Services/messengerForm';

import { Ads } from '@Interfaces';

export async function loaderProfilesAll(): Promise<boolean> {
  const divHtml = document.querySelector('.list-profiles');
  if (divHtml === null) {
    throw new Error('[ads -> loaderProfilesAll]: Not found. "div.list-ads"');
  }
  const trueFalseSessionId = checkCookieExists('sessionId');
  let sessionId = '0';
  if (trueFalseSessionId) {
    sessionId = getCookie('sessionId') as string;
  }

  const pathnameStr = `/api/v1/profiles/all/${sessionId}`;
  const body_ = JSON.stringify({});
  const result = await get(body_, pathnameStr) as unknown as Ads;
  if (typeof result === 'boolean' || !(result.profiles)) {
    const p = messageForUser(1, ['Загрузился', 'Не загрузился']);
    (divHtml as HTMLElement).insertAdjacentHTML('afterbegin', p.outerHTML);
    throw new Error('[ads -> loaderProfilesAll]: Not loaded. "GET" ');
  }
  return true;
}
