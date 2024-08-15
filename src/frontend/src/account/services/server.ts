import getCookie from './cookies';
import { FetchParams, FetchMethod } from '@Interfaces'
const HOST = process.env.APP_POSTGRES_HOST || 'localhost';
const PORT = process.env.APP_POSTGRES_HOST || '5432';
const PROTOCOL = process.env.APP_PROTOCOL_OF_URL || 'http';
const params: FetchParams = {
  method: FetchMethod.POST,
  mode: 'no-cors' as 'no-cors',
}


export default async function add(body_: string): Promise<void> {
  params['headers'] = {
    'X-CSRFToken': getCookie('csrftoken') as string,
    'Content-Type': 'application/json'
  } as FetchParams["headers"];
  params['body'] = body_;

  const url = `${PROTOCOL}://${HOST}:${PORT}/api/v1/clients/add/`
  const urls = new URL(url);
  const answer = await fetch(urls, params);
  if (answer.ok) {
    const dataJson = answer.json();
    return dataJson
  }

}


