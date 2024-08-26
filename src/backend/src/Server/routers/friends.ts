const { Router, Request, Response, NextFunction } = require('express');
// const { Client } = require('pg');
const {
  loaderAllProfilesSQL
} = require('../sql-functions/index');
const { clients } = require('../clients');
// const { getCookie } = require('../getCookies');
// const { checkerDubleEmails } = require('../validators');
const log = require('../logs/index');
const router = Router();
const { propsForClient } = require('./handlers');
export function routerFriends(routers: typeof router): typeof router {
  routers.get('/api/v1/profiles/all/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const sessionId = req.params.sessionId;
    await log(`[server -> router -> friends]: GET Friend ALL sessionId =>: ${sessionId}`);
    /* --------- Below, we is get the data from all profiles --------- */
    let respArr = await clients(loaderAllProfilesSQL);

    await log(`[server -> router -> friends]: GET Friend ALL Counter ${respArr.rows.length}`);
    if ((respArr.rows.length > 0) && (sessionId.length < 5)) {
      respArr = (respArr.rows).filter((item: typeof propsForClient) => item.session_id !== sessionId);
    } else if (respArr.rows.length === 0) {
      respArr = [];
    } else {
      respArr = respArr.rows;
    }
    await log('[server -> router -> friends]: GET Friend ALL is deforw sending');
    res.status(200).json({ message: 'OK', profiles: respArr });
  });
  return routers;
}
