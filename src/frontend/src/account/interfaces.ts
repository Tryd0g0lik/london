export enum Pages {
  Home = '/',
  Index = '/index',
  Regisration = '/registration',
  InLogin = '/inlogin',
  Profile = '/profile',
  ProfilePassworChanges = '/profile/password_change',
  Delete = '/profile/profile_dalete',
  Ads = '/profile/ads'
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
  types?: string
  classNames?: string
}
export interface ResultType {
  id: number;
  firstName: string;
  lastName: string;
  name?: string
  password: string
}
