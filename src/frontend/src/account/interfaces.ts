export enum Pages {
  Home = '/',
  Index = '/index',
  Regisration = '/registration',
}

export enum FetchMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export interface FetchParams {
  method: FetchMethod.POST,
  body?: string,
  headers?: {
    'X-CSRFToken': string,
    'Content-Type': 'application/json'
  }
  mode?: 'no-cors',
}

