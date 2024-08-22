import React, { useEffect } from 'react';
import { NavFC } from '@Components/NavOpPages';

export function ProfileAdsFC(): React.JSX.Element {
  return <>
    <NavFC />
    <div className='h'>
      <h3>Список добрых дел</h3>
    </div>
    <div data-namex='ads' className='profile form form-ads'>
      <button type='submit' className="btn btn-outline btn-secondary">Создать строчку</button>
    </div>
    <div className='profile form form-ads'>

    </div>
    <div className='profile form list-ads'>

    </div>

  </>
}
