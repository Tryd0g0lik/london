const { Router, Request, Response, NextFunction } = require('express');
const { propsForClient } = require('./handlers');
const {
  loaderAllProfilesSQL
} = require('../sql-functions/index');
const { clients } = require('../clients');
const router = Router();
export async function routerFriends(routers: typeof router): Promise<typeof router> {
  routers.get('/api/v1/profiles/all/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const sessionId = req.params.sessionId;
    /* --------- Below, we is get the data from all profiles --------- */
    let respArr = await clients(loaderAllProfilesSQL);

    if ((respArr.rows.length > 0) && (sessionId.length > 5)) {
      respArr = (respArr.rows).filter((item: typeof propsForClient) => item.session_id !== sessionId);
    } else if (respArr.rows.length === 0) {
      respArr = [];
    } else {
      respArr = respArr.rows;
    }
    res.status(200).json({ message: 'OK', profiles: respArr });
  });
  return routers;
}
