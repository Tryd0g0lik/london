const { Request: Request_, Response: Response_, NextFunction } = require('express');
// const { Client } = require('pg');

const {
  addNewAdsLineSQL,
  selectOneParamSQL,
  changeAdsSQL,
  dropTableLineSQL
} = require('../sql-functions/index');
const { clients } = require('../clients');
// const { getCookie } = require('../getCookies');
// const { checkerDubleEmails } = require('../validators');
const { sendNotFound } = require('./handlers');
const log_ = require('../logs/index');

export function routerClientsAds(routers: typeof router): typeof router {
  /* --------- Here is add a new ads's single line  --------- */
  routers.post('/api/v1/clients/ads/add/:sessionId', async (req: typeof Request_, res: typeof Response_, next: typeof NextFunction) => {
    await log_(`[server -> router -> ads]: POST  That request =>: ${JSON.stringify(req.body)}`);
    const clientData = req.body;
    const sessionId = clientData.cookie.sessionId;
    await log_(`[server -> router -> ads]: POST №1 sessionId =>: ${sessionId}`);
    /* -------------- This is activation's block ------------------ */
    // await log_(`[server -> router -> ads]: POST №2: ${JSON.stringify(sessionId)}`);

    /* --------- Below, we is get the data of only single user --------- */
    await log_(`[server -> router -> ads]: POST №3: ${sessionId}`);
    let respArr = await clients(selectOneParamSQL, { table: 'users', column: 'session_id', value: sessionId });
    let resp = sendNotFound(res, respArr.rows);
    if (typeof resp === 'boolean') {
      res.status(404).json({ message: 'Not Ok' });
      return false;
    };
    await log_(`[server -> router -> ads]: POST №4 Received data of db. Length =>: ${(respArr.rows).length}`);
    sendNotFound(res, respArr.rows);
    const emailId = respArr.rows[0].email_id;
    await log_(`[server -> router -> ads]: POST №5: emailId => ${emailId}`);
    /* --------------- Here is process saving a new sinпд ADS-line ------------------ */
    respArr = await clients(addNewAdsLineSQL, { table: 'ads', emailsId: emailId, titles: clientData.inputValues });
    resp = sendNotFound(res, respArr.rows);
    if (typeof resp === 'boolean') {
      res.status(404).json({ message: 'Not Ok' });
      return false;
    };
    log_(`[server -> router -> ads]: POST  №6 =>: ${JSON.stringify(respArr)}`);
    res.status(200).json({ message: 'OK', position: respArr.rows[0] });
  });

  routers.get('/api/v1/clients/ads/all/:sessionId', async (req: typeof Request_, res: typeof Response_, next: typeof NextFunction) => {
    await log_(`[server -> router -> ads]: GET ALL  That request =>: ${JSON.stringify(req[0])}`);
    // const clientData = req.body;
    const sessionId = req.params.sessionId;
    await log_(`[server -> router -> ads]: GET ALL №1 sessionId =>: ${sessionId}`);
    /* --------- Below, we is get the data of only single user --------- */
    await log_(`[server -> router -> ads]: GET ALL №2: ${sessionId}`);
    let respArr = await clients(selectOneParamSQL, { table: 'users', column: 'session_id', value: sessionId });
    const resp = sendNotFound(res, respArr.rows);
    if (typeof resp === 'boolean') {
      await log_(`[server -> router -> ads]: GET ALL №2.1: Here you need to check the cookie key  ${sessionId}`);
      res.status(404).json({ message: 'Not Ok' });
      return false;
    };
    /* --------- Below, we is to get the all data from only the one user  --------- */
    await log_(`[server -> router -> ads]: GET ALL №3 length => ${respArr.rows.length}`);
    const emailId = respArr.rows[0].email_id;
    respArr = await clients(selectOneParamSQL, { table: 'ads', column: 'email_id', value: emailId });
    log_(`[server -> router -> ads]: POST  №4 =>: ${JSON.stringify(respArr)}`);
    res.status(200).json({ message: 'OK', positions: respArr.rows });
  });

  routers.put('/api/v1/clients/ads/one/:sessionId', async (req: typeof Request_, res: typeof Response_, next: typeof NextFunction) => {
    await log_(`[server -> router -> ads]: PUT  That request =>: ${req}`);
    const clientData = req.body;
    const sessionId = req.params.sessionId;
    const newMesseges = clientData.titles;
    const indexMesseges = Number(clientData.indexMesseges);
    await log_(`[server -> router -> ads]: PUT №1 sessionId =>: ${sessionId}, message: =>  ${JSON.stringify(clientData)}`);
    /* --------- Below, we is get the data of only single user --------- */
    await log_(`[server -> router -> ads]: PUT №2: ${String(indexMesseges)}`);
    // let respArr = await clients(selectOneParamSQL, { table: 'ads', column: 'id', value: indexMesseges });
    // // let respArr = await clients(selectOneParamSQL, { table: 'ads', column: 'id', value: Number(indexMesseges) });
    // let resp = sendNotFound(res, respArr.rows);
    // if (typeof resp === 'boolean') {
    //   res.status(404).json({ message: 'Not Ok' });
    //   return false;
    // };
    // await log_(`[server -> router -> ads]: PUT №3 length: ${respArr.rows.length}`);

    const respArr = await clients(changeAdsSQL, { index: indexMesseges, titles: newMesseges });
    const resp = sendNotFound(res, respArr.rows);
    if (typeof resp === 'boolean') {
      res.status(404).json({ message: 'Not Ok' });
      return false;
    };
    await log_(`[server -> router -> ads]: PUT №3 length: ${respArr.rows.length}`);
    res.status(200).json({ message: 'OK' });
  });
  routers.delete('/api/v1/clients/ads/:index', async (req: typeof Request_, res: typeof Response_, next: typeof NextFunction) => {
    await log_(`[server -> router -> ads]: DELETE  That request =>: ${req}`);
    // const clientData = req.body;
    const ind = req.params.index;
    await clients(dropTableLineSQL, { table: 'ads', index: ind }, false, true);
    const props = { message: 'Removed' };
    res.status(200).json(props);
  });
  return routers;
};
