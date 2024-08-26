const { Request } = require('express');
const log = require('../logs/index');
const { propsForClient } = require('../interfaces');
/* -------------- */
export function sendNotFound(res: typeof Request, rows: unknown): boolean | unknown {
  if ((rows) && (rows as Array<typeof propsForClient>).length === 0) {
    log('[server -> router]: Not founded - 404 code');
    res.status(404).json({ massage: 'Not founded' });
    return false;
  }
  return rows;
};
