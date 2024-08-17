import { v4 as uuidv4 } from 'uuid';
const env = process.env.REACT_APP_POSTGRES_HOST;
const REACT_APP_POSTGRES_HOST = (env) ? env : "localhost";
/**
 *
 * @param sessionId that is install the key 'sessionId'
 */
export function setSessionIdInCookie(sessionId: string): void {
  const cookieName = 'sessionId';
  const cookieValue = sessionId;
  // const maxAge = 60 * 60 * 24 + 600000; // Время жизни cookie в секундах (например, 1 день)

  let now = new Date();
  const options = {
    expires: String(now.getTime()),
    path: '/',
    domain: REACT_APP_POSTGRES_HOST,
    secure: false,
    sameSite: 'Strict' as 'Strict'
  }
  setCookie(cookieName, cookieValue, options);
  // console.log('[Текущие cookies:]', `${cookieName}=${cookieValue}; max-age=${maxAge};  Domain=${REACT_APP_POSTGRES_HOST} Path=/ Samesite=strict`);
}


/**
 *
 * @param cookieName entrypoint received the a key-name from coockie and check his.
 * @returns trye/false;
 */
export function checkCookieExists(cookieName: string): boolean {
  // Получаем все cookies в виде строки
  const cookies = document.cookie;

  // Создаем регулярное выражение для поиска конкретного ключа
  const regex = new RegExp('(^|; )' + encodeURIComponent(cookieName) + '=([^;]*)');

  // Проверяем, есть ли совпадение
  return regex.test(cookies);
}



// Пример использования
// setSessionIdInCookie('abc123');
// Генерируем уникальный идентификатор
export function createSessionId(): string {
  return uuidv4();
}

/**
 *
 * @param prop true - удалить ключ-coockie + класс 'active'
 * @returns
 */
export async function checkerCoockieKey(prop = false): Promise<boolean> {

  const trueFalse = checkCookieExists('sessionId');
  const root = document.getElementById('root');
  if (root === null) {
    return false;
  }

  if (trueFalse) {
    // если видим ключа 'sessionId' - coockie ,
    // смотрим класс 'active'.
    // Если нету, добавляем.
    if (!(root.className).includes('active')) {
      if ((root.className).length === 0) {
        root.className = 'active';
      }
      root.className = `${root.className} active`;

    }
  } else {
    // если не видим ключа 'sessionId' - coockie ,
    // смотрим класс 'active' и удаляем его.
    if ((root.className).includes('active')) {
      root.className = root.className.replace('active', '');

    }
  }
  return true;
}

interface CookieOptions {
  expires?: Date | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}
/**
 * COOCKIE Installing
 */
function setCookie(name: string, value: string, options: CookieOptions = {}): void {

  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  // Кодируем имя и значение cookie
  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (const optionKey in options) {
    updatedCookie += "; " + optionKey;
    const optionValue = options[optionKey as keyof CookieOptions];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }


  document.cookie = updatedCookie;
}

/**
 * Searcher for coockie's key
 * @param name
 * @returns
 */
export function getCookie(name: string) {
  // eslint-disable-next-line
  const res = name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)";
  const reg = "(?:^|; )" + res;
  const regMax = new RegExp(reg);
  let matches = document.cookie.match(regMax);
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
