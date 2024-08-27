export enum Pages {
  Home = '/',
  Index = '/index',
  Regisration = '/registration',
  InLogin = '/inlogin',
  Profile = '/profile',
  Profile2 = '/profile/:profileIndex',
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

export interface Inpt {
  pathname: string
  body: {
    typeField: string
    newValueofField: string
    indexMesseges?: string
    indexEmails?: string
    titles?: string
  }
  sessionId?: string
}

export interface OneLine {
  firstName: string
  titles?: string
  id: number
  email_id: number
  first_name?: string
}
interface Rows {
  rows: OneLine[]
}



export interface Ads extends Rows {
  message: string
  positions?: OneLine[]
  position?: OneLine
  profiles: OneLine[]
}

export interface CookieOptions {
  expires?: Date | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}
export interface Res extends Rows {
  massege: string
  sessionId?: string;
}
