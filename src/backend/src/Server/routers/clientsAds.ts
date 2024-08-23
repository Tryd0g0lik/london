const { Router, Request: Request_, Response: Response_, NextFunction } = require('express');
const { Client } = require('pg');

const {
  addNewAdsLineSQL,
  selectOneParamQSL
} = require('../sql-functions/index');
const { clients } = require('../clients');
const { getCookie } = require('../getCookies');
const { checkerDubleEmails } = require('../validators');
const { propsForClient, sendNotFound, ClientData } = require('./handlers');
const log_ = require('../logs/index');
const REACT_APP_POSTGRES_HOST = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const REACT_APP_POSTGRES_PORT = (process.env.REACT_APP_POSTGRES_PORT as string | unknown) || '5432';
const REACT_APP_POSTGRES_DB_NAME = (process.env.REACT_APP_POSTGRES_DB_NAME as string | unknown) || 'london';
const REACT_APP_POSTGRES_USER = (process.env.REACT_APP_POSTGRES_USER as string | unknown) || 'postgres';
const REACT_APP_POSTGRES_DB_PASS = (process.env.REACT_APP_POSTGRES_DB_PASS as string | unknown) || '123';

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
    let respArr = await clients(selectOneParamQSL, { table: 'users', column: 'session_id', value: sessionId });
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
    let respArr = await clients(selectOneParamQSL, { table: 'users', column: 'session_id', value: sessionId });
    const resp = sendNotFound(res, respArr.rows);
    if (typeof resp === 'boolean') {
      res.status(404).json({ message: 'Not Ok' });
      return false;
    };
    /* --------- Below, we is to get the all data from only the one user  --------- */
    await log_(`[server -> router -> ads]: GET ALL №3 length => ${respArr.rows.length}`);
    const emailId = respArr.rows[0].email_id;
    respArr = await clients(selectOneParamQSL, { table: 'ads', column: 'email_id', value: emailId });
    log_(`[server -> router -> ads]: POST  №4 =>: ${JSON.stringify(respArr)}`);
    res.status(200).json({ message: 'OK', positions: respArr.rows });
  });
  return routers;
};
