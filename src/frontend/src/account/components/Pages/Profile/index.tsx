import React, { useEffect } from 'react';
import { NavFC } from '@Components/NavOpPages';
import { checkerCoockieKey } from '@Services/coockieSessionId';
import { infoLoader } from './handlers/installInfo';
import { handlerIdeFC } from './handlers/handlerIde'
export function ProfileFC(): React.JSX.Element {

  useEffect((): () => void => {
    infoLoader();
    checkerCoockieKey();
    return (): void => {
      handlerIdeFC();
    }
  }, []);

  return <>
    <NavFC />
    <div className='profile form'>
      <div className='profilename, profile-FirstName'>
        <input type="checkbox" className="switchs toggle toggle-xs" defaultChecked />
        <div></div>
        <div className='switchs-rewrite'></div>
      </div>
      <div className='profilename, profile-LastName'>
        <input type="checkbox" className="switchs  toggle toggle-xs" defaultChecked />
        <div></div>
        <div className='switchs-rewrite'></div>
      </div>
    </div>
    <div className="form">
    </div>
  </>
}


