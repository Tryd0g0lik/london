
import { get } from '@Services/fetches';
import { getCookie } from '@Services/coockieSessionId';

export async function infoLoader(): Promise<boolean> {
  const sessionId = getCookie('sessionId');
  if (sessionId === undefined) {
    return false;
  }
  interface ResultType {
    id: number;
    firstName: string;
    lastName: string;
    name: string
  }
  /* ---- Here is data received from the db ---- */
  const result = await get(JSON.stringify({}), `/api/v1/clients/${sessionId}`) as ResultType;
  if ((typeof result) === 'boolean') {
    return false;
  }
  const profile = document.querySelector('.profile');
  const profileALL = document.querySelectorAll('div.profilename');
  if (profileALL === null && profile === null) {
    return false;
  };



  const index = String(result.id as number);
  const name = result.firstName as string;
  const lastName = result.lastName as string;
  const d = profileALL[0].querySelector('div') as HTMLElement;
  const d2 = profileALL[1].querySelector('div') as HTMLElement;
  (profile as HTMLDivElement).dataset.index = index;
  d.innerHTML = name;
  d2.innerHTML = lastName;

  return true;
}
