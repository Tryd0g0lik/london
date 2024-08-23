const { Request } = require('express');
const log = require('../logs/index');
export interface propsForClient {
  readonly email: string
  readonly firstName?: string
  readonly lastName?: string
  readonly passwords: string
  password?: string
  cookie?: { sessionId: string }
};
export interface ClientData {
  typeField: string
  newValueofField: string
  columnNameArr?: string[]
}

/* -------------- */
export function sendNotFound(res: typeof Request, rows: unknown): boolean | unknown {
  if ((rows) && (rows as propsForClient[]).length === 0) {
    log('[server -> router]: Not founded - 404 code');
    res.status(404).json({ massage: 'Not founded' });
    return false;
  }
  return rows;
};
