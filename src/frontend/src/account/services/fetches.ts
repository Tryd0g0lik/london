import getCookie from './cookies';
import { FetchParams, FetchMethod } from '@Interfaces'

let env_ = process.env.REACT_APP_POSTGRES_HOST;
const HOST = (env_ === undefined) ? 'localhost' : env_.slice(0) as string;
env_ = process.env.REACT_APP_SERVER_PORT;
const PORT = (env_ === undefined) ? '7070' : env_.slice(0);
env_ = process.env.REACT_APP_PROTOCOL_OF_URL;
const PROTOCOL = (env_ === undefined) ? 'http' : env_.slice(0);
env_ = undefined;

let params: FetchParams = {
  method: FetchMethod.POST,
  mode: 'cors' as 'cors',
}


export async function add(body_: string,
  pathnameStr = '/api/v1/clients/add/'
): Promise<object | boolean | string> {
  params['headers'] = {
    'X-CSRFToken': getCookie('csrftoken') as string,
    'Content-Type': 'application/json'
  };
  params['body'] = body_;

  const urlStr = `${PROTOCOL}://${HOST}:${PORT}`;
  const url = urlStr + pathnameStr;
  const answer = await fetch(url, params);
  if (answer.ok) {
    const dataJson = answer.json();
    return dataJson
  }
  return false
}

/**
 *
//  * @param nody_ для актива
 */
// export async function activation(nody_: string)
params = {
  method: FetchMethod.GET,
  mode: 'cors' as 'cors'
}

export async function get(body_: string,
  pathnameStr = '/api/v1/clients/add/'
): Promise<object | boolean | string> {
  params['headers'] = {
    'X-CSRFToken': getCookie('csrftoken') as string,
    'Content-Type': 'application/json'
  };
  params['body'] = body_;

  const urlStr = `${PROTOCOL}://${HOST}:${PORT}`;
  const url = urlStr + pathnameStr;
  const answer = await fetch(url, params);
  if (answer.ok) {
    const dataJson = answer.json();
    return dataJson
  }
  return false
}
