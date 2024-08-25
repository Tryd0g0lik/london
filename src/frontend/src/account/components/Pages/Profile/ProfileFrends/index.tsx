import React, { useEffect } from 'react';
import { NavFC } from '@Components/NavOpPages';
export function ProfileFC(): React.JSX.Element {

  useEffect((): () => void => {

    return (): void => {
    }
  }, []);

  return <>
    <NavFC />
    <div className='h'>
      <h3>Список добрых дел</h3>
    </div>
    <section className='friends'></section>
    <div className='list-frends'></div>

  </>
}
