import React, { JSX } from 'react';
import { NavFC } from '@Components/NavOpPages';
import { add } from '@Services/fetches';
import { isValidEmail } from '@Services/validators/emal_validators'

// int - число. 0 зарегистрированб 1- не зарегистрирован.
function messageForUser(int: number): HTMLParagraphElement {
  const oldP = document.getElementById('note');
  if (oldP !== null) {
    (oldP as HTMLElement).innerHTML = '';
  }
  const p = document.createElement('p');
  p.id = 'note';
  p.style.paddingTop = 15 + 'px';
  p.style.color = (int === 0) ? 'green' : 'red';
  p.innerText = (int === 0) ? "Зарегистрирован" : "Не зарегистрирован";
  return p;
}

/**
 * Обработчик клика по кнопке из формы - отправляем данные в базу
 * @param event
 * @returns
 */
const handlerFormAuthorizator = async (event: React.MouseEvent): Promise<boolean> => {
  event.preventDefault();
  if ((event.type) && !(event.type !== 'Clicks')) {
    return false;
  };

  const target = (event.target as HTMLFormElement);
  if ((target.name) && (target.name !== 'oneRegistration')) {
    return false;
  };

  const form = (target.parentElement as HTMLElement).parentElement;
  if ((!form) || (form && (form.tagName !== 'FORM'))) {
    return false;
  };

  const emails = ((form as HTMLFormElement)[2] as HTMLInputElement).value;
  const password = ((form as HTMLFormElement)[3] as HTMLInputElement).value;

  // here is the emails checking
  const trueFalse = isValidEmail(emails);
  if (trueFalse === false) {
    // Подготовить сообщение об ошибке для пользователя.
    return false;
  }

  // here is the password checking.
  // Minim size/length of password is 3
  if (password.length < 3) {
    // Подготовить сообщение об ошибке для пользователя.
    return false;
  }

  const bodyStr = JSON.stringify({
    'email': emails,
    'password': password,
  });
  // отправляем в базу данных
  const responce = await add(bodyStr);
  if (!responce) {
    const result = messageForUser(1);
    form.insertAdjacentHTML('afterend', result.outerHTML);
    return false;
  }
  const result = messageForUser(0);
  form.insertAdjacentHTML('afterend', result.outerHTML);

  ((form as HTMLFormElement)[0] as HTMLInputElement).value = '';
  ((form as HTMLFormElement)[1] as HTMLInputElement).value = '';
  // const categoryUSerNumber = Number(target.dataset.category);
  // /* ------ */
  // const navCategories = Array.from(document.querySelectorAll('.catalog-categories.nav.justify-content-center .nav-item a'));
  // navCategories.forEach((item) => {
  //   (item as HTMLElement).classList.remove('active');
  // });
  // (target as HTMLElement).classList.add('active');

  // setUserCategory(categoryUSerNumber);
  return true;
};

export function PermissionPageFC(): JSX.Element {

  return (
    <>
      <NavFC />
      <div className="form">
        <form method="post">
          <div className='form-field emails'>
            <label htmlFor="emails" className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path
                  d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input id='email' name='email' type='email' maxLength={50} className="grow" placeholder="Email" />
            </label>
          </div>
          <div className='form-field passwords'>
            <label htmlFor="password" className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd" />
              </svg>
              <input id='password' name='password' type='password' maxLength={50} className="grow" />
            </label>
          </div>
          <div className='form-field button'>

            <input type="button" className='button btn btn-outline' name='oneRegistration' onClick={handlerFormAuthorizator} value='Отправить' />

          </div>
        </form>
      </div>
    </>

  )
}
