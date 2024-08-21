export enum Pages {
  Home = '/',
  Index = '/index',
  Regisration = '/registration',
  InLogin = '/inlogin',
  Profile = '/profile',
  ProfilePassworChanges = '/profile/password_change'
}

export enum FetchMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export interface FetchParams {
  method: FetchMethod,
  body?: string,
  headers?: {
    'X-CSRFToken'?: string,
    'Content-Type': 'application/json'
  }
  mode?: 'no-cors' | 'cors',
}


export interface FieldInnerHtml {
  text?: string
  dataNamex: string
}
