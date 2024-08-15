import React, { JSX, useEffect } from 'react';
import { RegisterPageFC } from './FormRegisrate';

const handlerFormRegigter = (event: React.MouseEvent): void => {
  event.preventDefault();
  const target = (event.target as HTMLFormElement);

  // const categoryUSerNumber = Number(target.dataset.category);
  // /* ------ */
  // const navCategories = Array.from(document.querySelectorAll('.catalog-categories.nav.justify-content-center .nav-item a'));
  // navCategories.forEach((item) => {
  //   (item as HTMLElement).classList.remove('active');
  // });
  // (target as HTMLElement).classList.add('active');

  // setUserCategory(categoryUSerNumber);
};

export function RegistrationPageFC(): JSX.Element {

  return (
    <section onClick={handlerFormRegigter} className='form-regitr'>
      <RegisterPageFC />
    </section>
  )
}
