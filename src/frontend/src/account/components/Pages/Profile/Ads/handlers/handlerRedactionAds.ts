import { handlerEventOfInputPUT } from '../../handlers/handlerIde';
import { Input } from '../../handlers/oop/inputForm';
import { Inpt } from '@Interfaces';
/** РЕДАКТИРОВАТЬ
 * This is the helper for listener of button. It's for redact/re-write the message (only one position/message).
 * @param elemLabelHtml: HTMLLabelElement. It's the input htmla-tage of entrypoint.
 * @param event : MouseEvent.
 * @returns boolean
 */
export function handlerRedactionOfButton(elemLabelHtml: HTMLLabelElement): (event: MouseEvent) => Promise<boolean> {

  return async (event: MouseEvent): Promise<boolean> => {
    // let indexOneMessege: string | null = null;
    if (((event.target as HTMLElement).tagName.toLowerCase() !== 'button') ||
      ((event.target as HTMLElement).outerText.toLowerCase() !== 'редактировать')) {
      return false;
    }
    const buttonHtml = (event.target as HTMLElement);
    const parantDivHtml = (buttonHtml.parentElement as HTMLDivElement).parentElement as HTMLDivElement;

    // Here is get the old text
    if (!(parantDivHtml.hasAttribute('data-numberx')) || !(parantDivHtml.hasAttribute('data-userx'))) {
      throw new Error('[ads -> handlerClickOfButton]: Not  found. "data-numberx" ');
    }
    // const indexOneEmail = parantDivHtml.getAttribute('data-userx');
    // indexOneMessege = parantDivHtml.getAttribute('data-numberx');
    const oldMessage = parantDivHtml.querySelector('p');
    if (oldMessage === null) {
      throw new Error('[ads -> handlerClickOfButton]: Not  found. "oldMessage" ');

    }
    // Here is insert to the input field and removing the html-tag name 'p';
    (elemLabelHtml.querySelector('input') as HTMLInputElement).placeholder = `${oldMessage.outerText}`;
    (elemLabelHtml.querySelector('input') as HTMLInputElement).setAttribute('data-current', 'redaction');
    (buttonHtml.parentElement as HTMLDivElement).insertAdjacentHTML('afterbegin', elemLabelHtml.outerHTML);

    buttonHtml.innerText = '';

    (oldMessage as HTMLElement).remove();
    setTimeout(() => {
      const parentDivinputHtml = document.querySelector('.profile.form.list-ads');
      if (parentDivinputHtml === null) {
        throw new Error('[ads -> loaderContents]: Not found. "div.list-ads"');
      }

      // @ts-ignore
      (parentDivinputHtml as HTMLElement).removeEventListener('keypress', subSubHandlerEventOfEnter());
      // @ts-ignore
      (parentDivinputHtml as HTMLElement).addEventListener('keypress', subSubHandlerEventOfEnter());
    }, 1000);

    return true;
  }
}

interface SubHand {
  titles: string
  indexMessege: string
}

/* redaction \
This is the postmane for  upgraded massege in to the PUT-request */
function subHandlerEventOfEnter(props: SubHand): (event: KeyboardEvent) => Promise<boolean> {
  const {
    titles,
    indexMessege
  } = props;

  return async (event: KeyboardEvent): Promise<boolean> => {


    /* Here  is  `pathname`. With It the 'sessionId' will be add inside of function name 'handlerEventOfInputPUT'. */
    const props = {
      pathname: `/api/v1/clients/ads/one/`,
      body: {
        titles: titles,
        indexMesseges: indexMessege
      }
    } as Inpt;
    const inputObj = new Input(props);
    /* this 'cookieSession' it will be added to the URL in end. */
    inputObj.cookieSession = 'sessionId';
    const cookieValue = inputObj.cookieSession;
    // @ts-ignore
    handlerEventOfInputPUT({ pathname: inputObj.pathnames, body: inputObj.body, sessionId: cookieValue })(event as KeyboardEvent);
    return true;
  }
}

// redaction
function subSubHandlerEventOfEnter(): (event: KeyboardEvent) => Promise<boolean> {
  return async (event: KeyboardEvent): Promise<boolean> => {
    if ((((event as KeyboardEvent).key) && ((event as KeyboardEvent).key).toLowerCase() !== 'enter')) {
      return false;
    }

    const target = event.target as HTMLInputElement;
    console.log('TEST => subHandlerEventOfEnter');
    if ((((target.parentElement as HTMLElement) === null) ||
      ((target.parentElement as HTMLElement).parentElement as HTMLElement) === null) ||
      (((target.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement) === null) {
      return false;
    }
    const indexOneMessege = (((target.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement).getAttribute('data-numberx');
    if (indexOneMessege === null) {
      console.log(new Error('[ads -> subSubHandlerEventOfEnter]: Not found. "data-numberx"'));
      return false;
    }
    subHandlerEventOfEnter({
      titles: target.value as string,
      indexMessege: indexOneMessege as string
    })(event as KeyboardEvent);

    /* Below is removing the Input tag and returns p-tag */
    const parentLabelElement = (target.parentElement as HTMLElement);
    if (parentLabelElement.parentElement === null) return false;
    const buttonHtml = (parentLabelElement.parentElement as HTMLDivElement).querySelector('button');

    if (buttonHtml === null) {
      throw new Error('[ads -> loaderContents]: Not found. "button"');
    }
    (buttonHtml).innerText = 'Редактировать';
    const p = document.createElement('p');
    p.innerText = target.value as string;

    (parentLabelElement.parentElement as HTMLDivElement).insertAdjacentHTML('beforebegin', p.outerHTML);
    parentLabelElement.remove();
    return true;
  }
}
