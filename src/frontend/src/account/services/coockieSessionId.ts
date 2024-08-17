import { v4 as uuidv4 } from 'uuid';
const env = process.env.REACT_APP_COOKIE_OPTIONS;
const REACT_APP_COOKIE_OPTIONS = (env) ? env : "sessionId=abc123; Secure; Path=/";

export function setSessionIdInCookie(sessionId: string): void {
  const cookieName = 'sessionId';
  const cookieValue = sessionId;
  const maxAge = 60 * 60 * 24; // Время жизни cookie в секундах (например, 1 день)

  document.cookie = `${cookieName}=${cookieValue}; max-age=${maxAge}; ${REACT_APP_COOKIE_OPTIONS} `;
}

// Пример использования
// setSessionIdInCookie('abc123');
// Генерируем уникальный идентификатор
export function createSessionId(): string {
  return uuidv4();
}
