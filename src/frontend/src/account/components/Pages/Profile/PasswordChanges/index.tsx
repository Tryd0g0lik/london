import React, { useState, useEffect } from 'react';
import { NavFC } from '../../../NavOpPages';
import { doGetRequest } from '@Services/fetches';
import { ResultType } from '@Interfaces';

export function ProfilePAsswordChangesFC(): React.JSX.Element {
  const [fields, setFields] = useState<Array<{ __html: React.JSX.Element }> | null>(null);
  const [pasw, setPasw] = useState<string | null>('Your pasword');
  useEffect(() => {
    const oneFiels = {
      __html: <label className="input input-bordered flex items-center gap-2">
        <input type="password" className="grow" placeholder={pasw as string} />
      </label>
    }
    setFields([oneFiels, oneFiels])

    const result = (async (): Promise<ResultType | boolean | string> => {
      const result = doGetRequest();
      return result;
    });
    result()
      .then((result) => {
        if (typeof result === 'boolean') {
          return false;
        }
        const answ = JSON.stringify(result);
        return answ;
      })
      .then((responce): boolean => {
        if (typeof result === 'boolean') {
          return false;
        }
        else {
          const res = (responce as unknown as ResultType).password as string;
          setPasw(res);
          return true;
        }

      })



    // eslint-disable-next-line
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
          </div>
        </div>
      </div>
      <div className="form">
      </div>
    </section>
  </React.Fragment>
}
