import { Inpt } from '@Interfaces';
import { getCookie } from '@Services/coockieSessionId';
/**
 * Entrypoint is:`
 * interface Inpt {
  pathname: string
  body: {
    typeField?: string
    newValueofField?: string
    indexMessege?: string
    indexEmail?: string
  } | string
  sessionId?: string
}`
 * This for the function 'handlerEventOfInputPUT' .  It sending \
 * PUT-request into the server.
 * Note!! The property a 'pathname' inserting only the path. \
 * It is without 'sessionId'. \
 * 'sessionId' added inside in  function 'handlerEventOfInputPUT'.
 *
 * `oblect.cookieSession` - SET  Here is only a single string/line/row  for entrypoint \
 * It's a name of cookie-key. \
 *  `oblect.cookieSession` GET Returns a value of cookie-key. \
 * @param event
 * @returns fooald
 */
export class Input {
  readonly pathnames: string

  body: Inpt['body']

  cookieKeyName: unknown | string


  constructor(props: Inpt) {
    const { pathname, body } = props;
    this.pathnames = pathname;
    this.body = body;
    this.cookieKeyName = ''
  }

  /**
   * Here is only a single string/line/row  for entrypoint \
   * It's a name of cookie-key.
   * @param `object.cookieSession = mane`
   */
  set cookieSession(param: string) {
    const trueFalse = getCookie(param);
    if (trueFalse) {
      this.cookieKeyName = param
    }

  }
  /**
   *
   * Returns a value of cookie-key.
   * @param `object.cookieSession = mane`
   * @returns Here is only a single string
   */
  get cookieSession(): string {
    const cookieKeyNames = this.cookieKeyName as string;
    if (cookieKeyNames.length > 0) {
      const value = getCookie(cookieKeyNames as string);
      return value as string;
    }
    return '';
  }


}
