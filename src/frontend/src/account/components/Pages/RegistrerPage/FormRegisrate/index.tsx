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
const handlerFormRegigter = async (event: React.MouseEvent): Promise<boolean> => {
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

  const firstName = ((form as HTMLFormElement)[0] as HTMLInputElement).value;
  const lastName = ((form as HTMLFormElement)[1] as HTMLInputElement).value;
  const emails = ((form as HTMLFormElement)[2] as HTMLInputElement).value;
  const password = ((form as HTMLFormElement)[3] as HTMLInputElement).value;
  const password2 = ((form as HTMLFormElement)[4] as HTMLInputElement).value;

  // here is a length checking
  if ((firstName.length === 0) || (lastName.length === 0) ||
    (emails.length === 0) || (password.length === 0) ||
    (password2.length === 0)) {
    // Подготовить сообщение об ошибке для пользователя.
    return false;
  };

  // here is the emails checking
  const trueFalse = isValidEmail(emails);
  if (trueFalse === false) {
    // Подготовить сообщение об ошибке для пользователя.
    return false;
  }

  // here is the password checking.
  // Minim size/length of password is 3
  if ((password.length < 3) || password !== password2) {
    // Подготовить сообщение об ошибке для пользователя.
    return false;
  }

  const bodyStr = JSON.stringify({
    'firstName': firstName,
    'lastName': lastName,
    'email': emails,
    'passwords': password,
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
  ((form as HTMLFormElement)[2] as HTMLInputElement).value = '';
  ((form as HTMLFormElement)[3] as HTMLInputElement).value = '';
  ((form as HTMLFormElement)[4] as HTMLInputElement).value = '';

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

export function RegisterPageFC(): JSX.Element {

  return (
    <>
      <NavFC />
      <div className="form">
        <form method="post">
          <div className='form-field firstname'>
            <label htmlFor="firstname">
              <input id='firstname' name='firstname' type='text' maxLength={50} />
            </label>
          </div>
          <div className='form-field lasttname'>
            <label htmlFor="lastname">
              <input id='lasttname' name='lasttname' type='text' maxLength={50} />
            </label>
          </div>
          <div className='form-field emails'>
            <label htmlFor="emails">
              <input id='email' name='email' type='email' maxLength={50} />
            </label>
          </div>
          <div className='form-field passwords'>
            <label htmlFor="password">
              <input id='email' name='password' type='password' maxLength={50} />
            </label>
          </div>
          <div className='form-field passwords'>
            <label htmlFor="password2">
              <input id='password2' name='password2' type='password' maxLength={50} />
            </label>
          </div>
          <div className='form-field button'>

            <input type="button" className='button' name='oneRegistration' onClick={handlerFormRegigter} value='Отправить' />

          </div>
        </form>
      </div>
    </>

  )
}
