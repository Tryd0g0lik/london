import { messageForUser } from '@Services/messengerForm';
import { getCookie } from '@Services/coockieSessionId';
import { put, get } from '@Services/fetches';
import { ResultType } from '@Interfaces';

/* --------------- Here is we working under passwords
  It's the event's handler. ------------------ */
export async function handlerClikOfInputPsw(event: MouseEvent): Promise<boolean> {
  if ((((event as MouseEvent).target as HTMLButtonElement).type) &&
    (((event as MouseEvent).target as HTMLButtonElement).type).toLowerCase() !== 'submit') {
    return false;
  }

  const currentTarget = event.currentTarget as HTMLElement;
  const atribute = currentTarget.hasAttribute('data-namex');
  if (!atribute) {
    throw new Error('[handlerClikOfInputPsw]: Something what wrong!');
  }
  const inputHtnlArr = currentTarget.querySelectorAll('input[type="password"]');
  if (inputHtnlArr.length === 0) {
    throw new Error('[handlerClikOfInputPsw]: Something what wrong! "imput"');
  }
  const value0 = (inputHtnlArr[0] as HTMLInputElement).value;
  const value1 = (inputHtnlArr[1] as HTMLInputElement).value;
  if ((value0 === value1) || (value0.length < 3) || (value1.length < 3)) {
    const p = messageForUser(1, ['Сохранился', 'Проверьте пароль'])
    /* here is a not save */
    currentTarget.insertAdjacentHTML('afterend', p.outerHTML);
    return false;
  }
  /* --------------- Here us a cookie is to get ------------------ */
  const sessionId = getCookie('sessionId');
  if (sessionId === undefined) {
    throw new Error('[handlerClikOfInputPsw]: Something what wrong! "sessionId"');
  }
  /* ---- Here is data received from the db ---- */
  const result1 = await get(JSON.stringify({}), `/api/v1/clients/${sessionId}`);
  if ((typeof result1) === 'boolean') {
    return false;
  }

  if ((result1 as ResultType).password !== value0) {
    const p = messageForUser(1, ['Сохранился', 'Проверье старый пароль!'])
    /* here is a not save */
    currentTarget.insertAdjacentHTML('afterend', p.outerHTML);
    return false;
  }

  const body_ = JSON.stringify({
    typeField: 'newPassword',
    newValueofField: value1
  })
  const result = await put(body_, `/api/v1/clients/${sessionId}`);
  if (result === false) {
    const p = messageForUser(1, ['Сохранился', 'Не сохранился']);
    /* here is a not save */
    currentTarget.insertAdjacentHTML('afterend', p.outerHTML);
    return false;
  }
  /* here is a save */
  (inputHtnlArr[0] as HTMLInputElement).value = '';
  (inputHtnlArr[1] as HTMLInputElement).value = '';
  const p = messageForUser(0, ['Сохранился', 'Не сохранился']);
  currentTarget.insertAdjacentHTML('afterend', p.outerHTML);


  return true;
}
