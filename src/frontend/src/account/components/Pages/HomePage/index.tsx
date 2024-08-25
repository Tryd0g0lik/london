import React, { JSX, useEffect } from 'react'
import { NavFC } from '@Components/NavOpPages'
import { checkerCookieKey } from '@Services/coockieSessionId';
import { loaderProfilesAll } from './handlers';
export function HomePageFC(): JSX.Element {
  useEffect(() => {
    checkerCookieKey();
    loaderProfilesAll()

  });
  return (<>
    <NavFC />
    <section className='profilesAll'>
      <div className='list-profiles'></div>
    </section>
  </>)
}
