const { Router, Request: Request_, Response: Response_, NextFunction } = require('express');
const router = Router();
const {
  addNewAdsLineSQL,
  selectOneParamSQL,
  changeAdsSQL,
  dropTableLineSQL
} = require('../sql-functions/index');
const { clients } = require('../clients');
const { sendNotFound } = require('./handlers');

export async function routerClientsAds(routers: typeof router): Promise<typeof router> {
  /* --------- Here is add a new ads's single line  --------- */
  routers.post('/api/v1/clients/ads/add/:sessionId', async (req: typeof Request_, res: typeof Response_, next: typeof NextFunction) => {
    const clientData = req.body;
    const sessionId = clientData.cookie.sessionId;
    /* -------------- This is activation's block ------------------ */

    /* --------- Below, we is get the data of only single user --------- */
    let respArr = await clients(selectOneParamSQL, { table: 'users', column: 'session_id', value: sessionId });
    let resp = sendNotFound(res, respArr.rows);
    if (typeof resp === 'boolean') {
      res.status(404).json({ message: 'Not Ok' });
      return false;
    };
    sendNotFound(res, respArr.rows);
    const emailId = respArr.rows[0].email_id;
    /* --------------- Here is process saving a new sinпд ADS-line ------------------ */
    respArr = await clients(addNewAdsLineSQL, { table: 'ads', emailsId: emailId, titles: clientData.inputValues });
    resp = sendNotFound(res, respArr.rows);
    if (typeof resp === 'boolean') {
      res.status(404).json({ message: 'Not Ok' });
      return false;
    };
    res.status(200).json({ message: 'OK', position: respArr.rows[0] });
  });

  routers.get('/api/v1/clients/ads/all/:sessionId', async (req: typeof Request_, res: typeof Response_, next: typeof NextFunction) => {
    // const clientData = req.body;
    const sessionId = req.params.sessionId;
    /* --------- Below, we is get the data of only single user --------- */
    let respArr = await clients(selectOneParamSQL, { table: 'users', column: 'session_id', value: sessionId });
    const resp = sendNotFound(res, respArr.rows);
    if (typeof resp === 'boolean') {
      res.status(404).json({ message: 'Not Ok' });
      return false;
    };
    /* --------- Below, we is to get the all data from only the one user  --------- */
    const emailId = respArr.rows[0].email_id;
    respArr = await clients(selectOneParamSQL, { table: 'ads', column: 'email_id', value: emailId });
    res.status(200).json({ message: 'OK', positions: respArr.rows });
  });

  routers.put('/api/v1/clients/ads/one/:sessionId', async (req: typeof Request_, res: typeof Response_, next: typeof NextFunction) => {
    const clientData = req.body;
    const newMesseges = clientData.titles;
    const indexMesseges = Number(clientData.indexMesseges);

    /* --------- Below, we is get the data of only single user --------- */
    const respArr = await clients(changeAdsSQL, { index: indexMesseges, titles: newMesseges });
    const resp = sendNotFound(res, respArr.rows);
    if (typeof resp === 'boolean') {
      res.status(404).json({ message: 'Not Ok' });
      return false;
    };
    res.status(200).json({ message: 'OK' });
  });
  routers.delete('/api/v1/clients/ads/:index', async (req: typeof Request_, res: typeof Response_, next: typeof NextFunction) => {
    const ind = req.params.index;
    await clients(dropTableLineSQL, { table: 'ads', index: ind }, false, true);
    const props = { message: 'Removed' };
    res.status(200).json(props);
  });
  routers.get('/api/v1/clients/ads/one/:index', async (req: typeof Request_, res: typeof Response_, next: typeof NextFunction) => {
    const ind = req.params.index;

    /* --------- Below, we is get the data of only single user --------- */
    const respArr = await clients(selectOneParamSQL, { table: 'ads', column: 'email_id', value: ind });
    const resp = sendNotFound(res, respArr.rows);
    if (typeof resp === 'boolean') {
      res.status(404).json({ massage: 'Not OK' });
      return false;
    };
    const props = { message: 'OK', rows: respArr.rows };
    res.status(200).json(props);
  });
  return routers;
};
