import React, { useEffect } from 'react';
import { NavFC } from '@Components/NavOpPages';
import { checkerCookieKey } from '@Services/coockieSessionId';
import { infoLoader } from './handlers/installInfo';
import { handlerIdeFC } from './handlers/handlerIde'
export function ProfileFC(): React.JSX.Element {

  useEffect((): () => void => {
    infoLoader();
    checkerCookieKey();
    return (): void => {
      handlerIdeFC();
    }
  }, []);

  return <>
    <NavFC />
    <div className='profile form'>
      <div data-namex='firstName' className='profilename profile-FirstName'>
        <span>First name</span>
        <input type="checkbox" className="switchs toggle toggle-xs" defaultChecked />
        <div></div>
        <div className='switchs-rewrite'></div>
      </div>
      <div data-namex='lastName' className='profilename profile-LastName'>
        <span>Last name</span>
        <input type="checkbox" className="switchs  toggle toggle-xs" defaultChecked />
        <div></div>
        <div className='switchs-rewrite'></div>
      </div>
    </div>
    <div className="form">
    </div>
  </>
}


