const { Request } = require('express');
const { propsForClient } = require('../interfaces');
/* -------------- */
export function sendNotFound(res: typeof Request, rows: unknown): boolean | unknown {
  if ((rows) && (rows as Array<typeof propsForClient>).length === 0) {
    res.status(404).json({ massage: 'Not founded' });
    return false;
  }
  return rows;
};
