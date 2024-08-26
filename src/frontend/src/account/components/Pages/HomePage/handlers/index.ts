import { get } from '@Services/fetches';
import { getCookie, checkCookieExists } from '@Services/coockieSessionId';
import { Ads, OneLine } from '@Interfaces';

export async function loaderProfilesAll(states: React.Dispatch<React.SetStateAction<Array<OneLine>>>): Promise<boolean> {
  const trueFalseSessionId = checkCookieExists('sessionId');
  let sessionId = '0';
  if (trueFalseSessionId) {
    sessionId = getCookie('sessionId') as string;
  }

  const pathnameStr = `/api/v1/profiles/all/${sessionId}`;
  const body_ = JSON.stringify({});
  const result = await get(body_, pathnameStr) as unknown as Ads;
  if (typeof result === 'boolean' || !(result.profiles)) {
    throw new Error('[ads -> loaderProfilesAll]: Not loaded. "GET" ');
  }
  states(result.profiles);
  return true;
}

