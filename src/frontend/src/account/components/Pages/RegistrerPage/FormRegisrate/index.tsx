import React, { JSX } from 'react';
import { NavFC } from '@Components/NavOpPages';
export function RegisterPageFC(): JSX.Element {

  return (
    <>
      <NavFC />
      <div className="form">
        <form method="post">
          <div className='inpute firstname'>
            <label htmlFor="firstname">
              <input id='firstname' type='text' maxLength={50} />
            </label>
          </div>
          <div className='inpute lasttname'>
            <label htmlFor="lastname">
              <input id='lasttname' type='text' maxLength={50} />
            </label>
          </div>
          <div className='inpute emails'>
            <label htmlFor="emails">
              <input id='email' type='email' maxLength={50} />
            </label>
          </div>
        </form>
      </div>
    </>

  )
}
