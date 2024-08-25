import React, { JSX, useEffect } from 'react'
import { NavFC } from '@Components/NavOpPages'
import { checkerCookieKey } from '@Services/coockieSessionId';
export function HomePageFC(): JSX.Element {
  useEffect(() => {
    checkerCookieKey();

  });
  return (<>
    <NavFC />
    <div className='list-frends'></div>
  </>)
}
