import getCookie from './cookies';
import { FetchParams, FetchMethod } from '@Interfaces'

let env_ = process.env.REACT_APP_POSTGRES_HOST;
const HOST = (env_ === undefined) ? 'localhost' : env_.slice(0) as string;
env_ = process.env.REACT_APP_SERVER_PORT;
const PORT = (env_ === undefined) ? '7070' : env_.slice(0);
env_ = process.env.REACT_APP_PROTOCOL_OF_URL;
const PROTOCOL = (env_ === undefined) ? 'http' : env_.slice(0);
env_ = undefined;

const params: FetchParams = {
  method: FetchMethod.POST,
  mode: 'cors' as 'cors',
}


export async function add(body_: string): Promise<object | boolean> {
  params['headers'] = {
    'X-CSRFToken': getCookie('csrftoken') as string,
    'Content-Type': 'application/json'
  };
  params['body'] = body_;

  const urlStr = `${PROTOCOL}://${HOST}:${PORT}`;
  const pathnameStr = '/api/v1/clients/add/';
  const url = urlStr + pathnameStr;
  const answer = await fetch(url, params);
  if (answer.ok) {
    const dataJson = answer.json();
    return dataJson
  }
  return false
}

