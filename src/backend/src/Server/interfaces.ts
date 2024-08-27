const { Client } = require('pg');
export interface Email {
  'email': string
}

export interface NewSqlLine extends Email {
  firstName: string
  lastName: string
}
export interface FieldInnerHtml {
  cookie?: string
  text?: string
  dataNamex: string
  typeField?: string
  newValueofField?: string | boolean
};

export interface ChengeSingleUser {
  table: string
  title: string
  v: boolean | string
  email: string
  clt: typeof Client
}
export interface ClientData {
  typeField: string
  newValueofField: string
  columnNameArr?: string[]
}

export interface propsForClient {
  readonly index?: number
  readonly tableName?: string
  table?: string
  readonly email?: string
  readonly firstName?: string
  readonly lastName?: string
  readonly references?: string
  readonly myId?: string
  readonly friendId?: string
  passwords?: string
  password?: string
  cookie?: { sessionId: string }
};
export interface Props extends propsForClient {
  emailId?: number
  newEmail?: string
  email_id?: number
  newPassword?: string
  isActive?: boolean
  isActivated?: boolean
  sendMessage?: boolean
  sessionId?: string
}
export interface Propse {
  column: string
  value: string
  table: 'users' | 'emails'
}
export interface Put {
  index?: number
  email: string
  newEmail: string
  firstName: string
  lastName: string
  newPassword: string
  emailId: number
  isActive?: boolean
  isActivated?: boolean
  sendMessage?: boolean
  table?: string
  titles?: string
  emailsId?: number
}

export interface NewSqlLine {
  email: string
  firstName: string
  lastName: string
  passwords: string
  titles?: string

};
