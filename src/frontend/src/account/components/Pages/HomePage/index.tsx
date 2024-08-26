import React, { JSX, useEffect, useState } from 'react'
import { NavFC } from '@Components/NavOpPages'
import { checkerCookieKey, checkCookieExists } from '@Services/coockieSessionId';
import { loaderProfilesAll } from './handlers';
import { OneLine } from "@Interfaces";

export function HomePageFC(): JSX.Element {
  const [profiles, setProfiles] = useState<Array<OneLine> | []>([]);
  useEffect(() => {
    checkerCookieKey();
    const fetchData = async () => {
      await loaderProfilesAll(setProfiles); // Вызываем асинхронную функцию
      if (checkCookieExists('sessionId')) {
        const divHtmlAll = document.querySelectorAll('.list-profiles .profile');
        if (divHtmlAll.length > 0) {
          const buttonHtml = document.createElement('button');
          buttonHtml.innerText = 'Удалить из друзей';
          for (let i = 0; i < divHtmlAll.length; i++) {
            divHtmlAll[i].appendChild(buttonHtml);
          }
        }
      }
    };

    checkerCookieKey();
    fetchData();

  }, []);

  return (<>
    <NavFC />
    <section className='profilesAll'>
      <div className='list-profiles'>
        <ul>
          {
            Array.from(profiles).map((item, index) => (
              <li className='profile' key={index} data-userx={String(item.id)}>
                <a href={`/profile/${item.id}`}>{item.first_name}</a>
              </li>
            ))
          }
        </ul>
      </div>
    </section>
  </>)
}
