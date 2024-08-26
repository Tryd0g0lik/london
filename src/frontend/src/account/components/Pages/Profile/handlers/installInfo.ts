
import { get } from '@Services/fetches';
import { getCookie } from '@Services/coockieSessionId';
import { ResultType } from '@Interfaces';
export async function infoLoader(): Promise<boolean> {
  const sessionId = getCookie('sessionId');
  if (sessionId === undefined) {
    return false;
  }

  const currentPathname = window.location.pathname;
  const regex = /^\d+$/;
  const arr = currentPathname.split('/');

  let clientIndex = 'Null';
  if (arr.length > 1 &&
    regex.test(arr[arr.length - 1])) {
    clientIndex = arr[arr.length - 1];
  }
  /* ---- Here is data received from the db ---- */

  const result = await get(JSON.stringify({}), (clientIndex === 'Null')
    ? `/api/v1/clients/${sessionId}`
    : `/api/v1/clients/${clientIndex}/${sessionId}`) as ResultType;
  if ((typeof result) === 'boolean') {
    return false;
  }
  const profile = document.querySelector('.profile');
  const profileALL = document.querySelectorAll('div.profilename');
  if (profileALL === null && profile === null) {
    return false;
  };


  if (result.id !== undefined) {
  const index = String(result.id as number);
  const name = result.firstName as string;
  const lastName = result.lastName as string;
  const d = profileALL[0].querySelector('div') as HTMLElement;
  const d2 = profileALL[1].querySelector('div') as HTMLElement;
  (profile as HTMLDivElement).dataset.index = index;
  d.innerHTML = name;
  d2.innerHTML = lastName;
  } else {
    profile?.remove();
  }

  return true;
}
