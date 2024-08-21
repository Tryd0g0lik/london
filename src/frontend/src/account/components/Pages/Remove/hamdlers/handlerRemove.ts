import { getCookie } from '@Services/coockieSessionId';
import { remove } from '@Services/fetches';
import { messageForUser } from '@Services/messengerForm';
import { deleteCookie } from '@Services/coockieSessionId';
export async function handlerDelete(event: MouseEvent): Promise<boolean> {
  if ((((event as MouseEvent).target as HTMLButtonElement).type) &&
    (((event as MouseEvent).target as HTMLButtonElement).type).toLowerCase() !== 'submit') {
    return false;
  }

  const currentTarget = event.currentTarget as HTMLElement;
  const atribute = currentTarget.hasAttribute('data-namex');
  if (!atribute) {
    throw new Error('[handlerClikOfInputPsw]: Something what wrong!');
  }

  /* --------------- Here us a cookie is to get ------------------ */
  const sessionId = getCookie('sessionId');
  if (sessionId === undefined) {
    throw new Error('[handlerClikOfInputPsw]: Something what wrong! "sessionId"');
  }
  const result = await remove(`/api/v1/clients/${sessionId}`);
  if (result === false) {
    const p = messageForUser(1, ['Сохранился', 'Не удален']);
    /* here is a not save */
    currentTarget.insertAdjacentHTML('afterend', p.outerHTML);
    return false;
  }
  deleteCookie('sessionId');
  // currentTarget.insertAdjacentHTML('afterend', p.outerHTML);
  return true;
}
