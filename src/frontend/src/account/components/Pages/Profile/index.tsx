import React, { useEffect } from 'react';
import { NavFC } from '@Components/NavOpPages';
import { checkerCoockieKey } from '@Services/coockieSessionId';
import { get } from '@Services/fetches';
import { getCookie } from '@Services/coockieSessionId';
export function ProfileFC(): React.JSX.Element {
  async function infoLoader(): Promise<boolean> {
    const sessionId = getCookie('sessionId');
    if (sessionId === undefined) {
      return false;
    }
    get(JSON.stringify({}), `api/v1/clients/${sessionId}/`);
    return true;
  }
  useEffect((): void => {
    infoLoader()
      checkerCoockieKey();
  }, []);

  return <>
    <NavFC />
  </>
}
