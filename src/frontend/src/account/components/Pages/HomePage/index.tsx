import React, { JSX, useEffect } from 'react'
import { NavFC } from '@Components/NavOpPages'
import { checkerCoockieKey } from '@Services/coockieSessionId';
export function HomePageFC(): JSX.Element {
  useEffect(() => {
    checkerCoockieKey();
  });
  return (<>
    <NavFC />
  </>)
}
