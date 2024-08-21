import React, { useState, useEffect } from 'react';
import { NavFC } from '../../../NavOpPages';
import { doGetRequest } from '@Services/fetches';
import { ResultType } from '@Interfaces';
import { handlerClikOfInputPsw } from './handlers/handlersPsw';

// import { add } from '@Services/fetches';

export function ProfilePAsswordChangesFC(): React.JSX.Element {
  const [fields, setFields] = useState<Array<{ __html: React.JSX.Element }> | null>(null);

  useEffect(() => {

    const oneFiels = {
      __html: <label className="input input-bordered flex items-center gap-2">
        <input type="password" className="grow" placeholder="Your password" />
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

        return result;
      })
      .then((responce): boolean => {
        if (typeof result === 'boolean') {
          return false;
        }
        else {
          return true;
        }

      })

    /* ---- handler  for a MouseEvent and KeyboardEvent ---- */
    // handlerClikOfInputPsw
    const passwordsHtml = document.querySelector('div[data-namex="passwords"]');
    if (passwordsHtml !== null) {
      // (passwordsHtml as HTMLDivElement).removeEventListener('keypress', handlerClikOfInputPsw);
      (passwordsHtml as HTMLDivElement).removeEventListener('click', handlerClikOfInputPsw);
      // (passwordsHtml as HTMLDivElement).addEventListener('keypress', handlerClikOfInputPsw);
      (passwordsHtml as HTMLDivElement).addEventListener('click', handlerClikOfInputPsw);
    }
    // eslint-disable-next-line
  }, []);

  return <React.Fragment>
    <NavFC />
    <section>
      <div className='h'>
        <h3>Изменить Пароль </h3>
      </div>
      <div className='paswords profile form'>

        <div data-namex='passwords' className='passwords'>
          <div className='switchs-rewrite'>
            {(fields !== null) ?
              Array.from(fields).map((_item, index) => (
                <div key={index} data-namex={'password' + String(index + 1)}
                  className='password profile-password' >
                  <span>{(index === 0) ? 'Действующий пароль:' : 'Новый пароль:'}</span>
                  {_item.__html}
                </div>
              )) : '<div></div>'
            }
            <button type='submit' className="btn btn-outline btn-secondary">Сохранить</button>
          </div>

        </div>
      </div>
    </section>
  </React.Fragment>
}
