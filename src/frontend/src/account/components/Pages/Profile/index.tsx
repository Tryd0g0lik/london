import React, { useEffect } from 'react';
import { NavFC } from '@Components/NavOpPages';
import { checkerCoockieKey } from '@Services/coockieSessionId';
export function ProfileFC(): React.JSX.Element {
  useEffect((): void => {
      checkerCoockieKey();
  }, []);

  return <>
    <NavFC />
  </>
}
