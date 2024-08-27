import React, { useEffect, useState } from 'react';
import { NavFC } from '@Components/NavOpPages';
import { checkerCookieKey, checkCookieExists } from '@Services/coockieSessionId';
import { infoLoader } from './handlers/installInfo';
// import { handlerIdeFC } from './handlers/handlerIde'
const basisHtml = <>
  <div data-namex='firstName' className='profilename profile-FirstName'></div>
  <div data-namex='lastName' className='profilename profile-LastName'></div>
</> as React.ReactNode;
const divHtml = <>
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
</> as React.ReactNode;
export function ProfileFC(): React.JSX.Element {
  const [status, setStatus] = useState<React.ReactNode>(basisHtml);



  useEffect((): () => void => {

    const funAsync = async (): Promise<boolean> => {
      infoLoader();
      checkerCookieKey();
      if (!checkCookieExists('sessionId')) {
        return false;
      }

      const currentPathname = window.location.pathname;
      const regex = /^\d+$/;
      const arr = currentPathname.split('/');
      if (arr.length === 0) {
        return false;
      }

      if (regex.test(arr[arr.length - 1])) {
        const divHtml = document.querySelector('.myFriend');
        const buttonHtml = document.createElement('button');

        buttonHtml.type = 'submit';
        buttonHtml.className = 'btn btn-outline btn-accent';
        buttonHtml.innerText = 'Добавить в друзья';
        const buttonHtml2 = buttonHtml.cloneNode(true) as HTMLDivElement;
        buttonHtml2.innerText = 'Смотреть объявления';
        divHtml?.appendChild(buttonHtml);
        divHtml?.appendChild(buttonHtml2);
        return true;
      }

      return false;
    }

    const checkSessionAndUpdateStatus = async () => {
      const sessionExists = checkCookieExists('sessionId');
      if (sessionExists) {
        setStatus(divHtml);
      } else {
        setStatus(basisHtml);
      }
    };
    checkSessionAndUpdateStatus();
    return (): void => {
      funAsync();
    }
  }, []);


  return <>
    <NavFC />
    <div className='profile form'>
      <div className='myFriend form '>
      </div>
      {status}
    </div>
    <div className="form">
    </div>
  </>
}


