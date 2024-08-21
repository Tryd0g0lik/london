import React, { useState, useEffect } from 'react';
import { NavFC } from '../../../NavOpPages';
export function ProfilePAsswordChangesFC(): React.JSX.Element {
  const [fields, setFields] = useState<Array<{ __html: React.JSX.Element }> | null>(null);

  useEffect(() => {
    const oneFiels = {
      __html: <label className="input input-bordered flex items-center gap-2">
        <input type="password" className="grow" />
      </label>
    }
    setFields([oneFiels, oneFiels])
  }, []);

  return <React.Fragment>
    <NavFC />
    <section>
      <div className='h'>
        <h3>Изменить Пароль </h3>
      </div>
      <div className='paswords profile form'>
        <div className='switchers'>
          <input type="checkbox" className="switchs toggle toggle-xs" defaultChecked />
        </div>
        <div data-namex='password1' className='password profile-FirstName'>
          <span>Your password</span>
          <div className='switchs-rewrite'>
            {(fields !== null) ?
              Array.from(fields).map((_item, index) => (
                <div key={index} data-namex={'password' + String(index) + 1}
                  className='password profile-LastName' >
                  {_item.__html}
                </div>
              )) : '<div></div>'
            }
            {/* {fields && (
              <div
                data-namex="password"
                className="password profile-LastName"
                dangerouslySetInnerHTML={fields}
              />
            )} */}
          </div>
        </div>
      </div>
      <div className="form">
      </div>
    </section>
  </React.Fragment>
}
