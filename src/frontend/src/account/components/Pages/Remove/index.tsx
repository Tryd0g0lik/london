import React, { useEffect } from 'react';
import { NavFC } from '../../NavOpPages';

import { handlerDelete } from './hamdlers/handlerRemove';
import { checkerCookieKey } from '@Services/coockieSessionId';
export function ProfileRemoveFC(): React.JSX.Element {
  useEffect(() => {
    checkerCookieKey();
    const helper = (): boolean => {

      const divHtml = document.querySelector('div[data-namex="passwords"]');
      if (divHtml === null) {
        throw new Error('[ProfileRemoveFC]: Something what wrong!');
      }
      (divHtml as HTMLElement).removeEventListener('click', handlerDelete);
      (divHtml as HTMLElement).addEventListener('click', handlerDelete);
      return true;
    }
    helper();
  }, [])
  return (
    <>
      <NavFC />
      <div data-namex='passwords' className='passwords'>
        <button className="btn btn-outline btn-secondary">Удалить</button>
      </div>
    </>
  )
}
