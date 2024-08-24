import { OneLine, Ads } from '@Interfaces';
import { getCookie, checkCookieExists } from '@Services/coockieSessionId';
import { messageForUser } from '@Services/messengerForm';
import { get } from '@Services/fetches';
import { createDivLableContainer } from '@Services/fields';
import { handlerRedactionOfButton } from './handlerRedactionAds';
/** The download aLL positions.
 * Here is we download all positions from the db
 * @param elemLabelHtml: HTMLLabelElement. It's the input htmla-tage of entrypoint. It giving \
 * to the function 'handlerClickOfButton'
 */
export async function loaderContents(elemLabelHtml: HTMLLabelElement): Promise<void> {
  const divHtml = document.querySelector('.profile.form.list-ads');
  if (divHtml === null) {
    throw new Error('[ads -> loaderContents]: Not found. "div.list-ads"');
  }
  const trueFalseSessionId = checkCookieExists('sessionId');
  if (!trueFalseSessionId) {
    throw new Error('[ads -> handlerEnterofInput]: Not  found. "sessionId" ');
  }

  const cookieSessionId = getCookie('sessionId');

  const pathnameStr = `/api/v1/clients/ads/all/${cookieSessionId}`;
  const body_ = JSON.stringify({});
  const result = await get(body_, pathnameStr) as unknown as Ads;
  if (typeof result === 'boolean' || !(result.positions)) {
    const p = messageForUser(1, ['Загрузился', 'Не загрузился']);
    (divHtml as HTMLElement).insertAdjacentHTML('afterbegin', p.outerHTML);
    throw new Error('[ads -> handlerEnterofInput]: Not loaded. "GET" ');
  }
  const positions = result.positions;
  /*
  interface OneLine {
    titles?: string
    id: number
    email_id: number
  }
  interface Rows {
    rows: OneLine[]
  }

  interface Ads extends Rows {
    message: string
    positions?: OneLine[]
    position?: OneLine
  }
    Here we creating a message's list. It is message we resived from db,  for only single user
  */
  for (let i = 0; i < positions.length; i++) {
    const {
      titles,
      id,
      email_id
    } = positions[i] as OneLine;
    const divHtmlMessage = createDivLableContainer({
      titles: titles,
      id: id,
      email_id: email_id
    });

    (divHtml as HTMLElement).insertAdjacentElement('beforeend', divHtmlMessage);
  };
  if (divHtml === null) {
    throw new Error('[profile -> ads -> handlerClickOfButton]: Something whtat wrong! ".profile.form.list-ads"');
  };

  (divHtml as HTMLDivElement).removeEventListener('click', (event: MouseEventInit) => handlerRedactionOfButton(elemLabelHtml)(event as MouseEvent));
  (divHtml as HTMLDivElement).addEventListener('click', (event: MouseEventInit) => handlerRedactionOfButton(elemLabelHtml)(event as MouseEvent));
}
