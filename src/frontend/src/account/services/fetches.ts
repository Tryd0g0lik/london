import getCookie from './cookies';
import { FetchParams, FetchMethod } from '@Interfaces'

let env_ = process.env.REACT_APP_POSTGRES_HOST;
const HOST = (env_ === undefined) ? 'localhost' : env_.slice(0) as string;
env_ = process.env.REACT_APP_SERVER_PORT;
const PORT = (env_ === undefined) ? '7070' : env_.slice(0);
env_ = process.env.REACT_APP_PROTOCOL_OF_URL;
const PROTOCOL = (env_ === undefined) ? 'http' : env_.slice(0);
env_ = process.env.REACT_APP_SET_TTIMOUT;
const REACT_APP_SET_TTIMOUT = (env_ === undefined) ? 2000 : env_.slice(0);
env_ = undefined;

const params: FetchParams = {
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
  const paramsCopy = {}
  Object.assign(paramsCopy, params);
  const urlStr = `${PROTOCOL}://${HOST}:${PORT}`;
  const url = urlStr + pathnameStr;
  const registrateTimout = setTimeout(() => {
    return false
  }, REACT_APP_SET_TTIMOUT as number);
  const answer = await fetch(url, paramsCopy);
  clearTimeout(registrateTimout);
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


export async function get(body_: string,
  pathnameStr = '/api/v1/clients/add/'
): Promise<object | boolean | string> {
  // const paramsCopy = {} as FetchParams
  // Object.assign(paramsCopy, params);
  // paramsCopy.method = FetchMethod.GET;
  // // paramsCopy['body'] = body_;
  // paramsCopy['headers'] = {
  // // 'X-CSRFToken': getCookie('csrftoken') as string,
  //   'Content-Type': 'application/json'
  // };
  // paramsCopy.mode = 'no-cors';
  const urlStr = `${PROTOCOL}://${HOST}:${PORT}`;
  const url = urlStr + pathnameStr;
  const registrateTimout = setTimeout(() => {
    return false
  }, REACT_APP_SET_TTIMOUT as number);
  const answer = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  clearTimeout(registrateTimout);
  if (answer.ok) {
    const dataJson = answer.json();
    return dataJson
  }
  return false
}
