import React, { useEffect } from 'react';
import { NavFC } from '@Components/NavOpPages';
export function ProfileFC(): React.JSX.Element {
  // coockie
  // sessionId
  useEffect((): void => {
    const root = document.getElementById('root') as HTMLElement || null;
    if (root !== null) {
      root.className = 'active';
    }


  }, []);

  return <>
    <NavFC />
  </>
}
