import { remove } from '@Services/fetches';
import { getCookie } from '@Services/coockieSessionId';

export async function handlerEventRemoveAds(event: MouseEvent): Promise<boolean> {
  // let indexOneMessege: string | null = null;
  console.log('УДАЛИТИЬ 1', event);
  if (((event.target as HTMLElement).tagName.toLowerCase() !== 'button') ||
    ((event.target as HTMLElement).outerText.toLowerCase() !== 'удалить')) {
    return false;
  }
  console.log('УДАЛИТИЬ 2');
  const target = (event.target as HTMLElement);
  const divHtml = ((target.parentElement as HTMLElement).parentElement as HTMLElement);
  if (!divHtml.hasAttribute('data-numberx')) {
    return false;
  }
  const atribDataNumberx = divHtml.getAttribute('data-numberx');
  /* --------------- Here us a cookie is to get ------------------ */
  const sessionId = getCookie('sessionId');
  if (sessionId === undefined) {
    throw new Error('[handlerClikOfInputPsw]: Something what wrong! "sessionId"');
  }
  const result = await remove(`/api/v1/clients/ads/${atribDataNumberx}`);
  if (result === false) {
    /* here is a not save */
    return false;
  }

  console.log('УДАЛИТИЬ 3', atribDataNumberx);
  divHtml.remove();
  return true;

}
