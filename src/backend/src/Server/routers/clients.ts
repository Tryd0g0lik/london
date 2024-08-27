const { Router, Request, Response, NextFunction } = require('express');
const { Client } = require('pg');
const { Props } = require('../interfaces');
const {
  addNewLineSQL, selectSingleUserSQL,
  changeValueOneCellSQL, selectOneParamSQL,
  changeValueAllCellSQL, changeEmailSQL, dropTableLineSQL,
  addNewFriendSQL
} = require('../sql-functions/index');
const { clients } = require('../clients');
const { checkerDubleEmails } = require('../validators');
const { propsForClient, sendNotFound } = require('./handlers');
const router = Router();

const REACT_APP_POSTGRES_HOST = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const REACT_APP_POSTGRES_PORT = (process.env.REACT_APP_POSTGRES_PORT as string | unknown) || '5432';
const REACT_APP_POSTGRES_DB_NAME = (process.env.REACT_APP_POSTGRES_DB_NAME as string | unknown) || 'london';
const REACT_APP_POSTGRES_USER = (process.env.REACT_APP_POSTGRES_USER as string | unknown) || 'postgres';
const REACT_APP_POSTGRES_DB_PASS = (process.env.REACT_APP_POSTGRES_DB_PASS as string | unknown) || '123';

export async function routerClients(routers: typeof router): Promise<typeof router> {
  /* --------- Below, is adding a new friend --------- */
  routers.post('/api/v1/clients/:clientsId/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const sessionId = req.params.sessionId;
    const clientsId = req.params.clientsId;
    const reference = req.body.references;
    // получил seessionID не схожжее с db.sessionId
    let result = await clients(selectOneParamSQL, { table: 'users', column: 'id', value: Number(clientsId) });
    let resp = sendNotFound(res, result.rows);
    if (typeof resp === 'boolean') return;
    const newMyFriendId = result.rows[0].id;
    result = await clients(selectOneParamSQL, { table: 'users', column: 'session_id', value: sessionId });
    const myInd = result.rows[0].id;
    resp = sendNotFound(res, result.rows);
    if (typeof resp === 'boolean') return;
    result = await clients(addNewFriendSQL, { references: reference, myId: Number(myInd), friendId: Number(newMyFriendId) });
    resp = sendNotFound(res, result.rows);
    if (typeof resp === 'boolean' || (!result.rows)) {
      res.status(400).json({
        message: 'Not OK'
      });
      return false;
    };
    res.status(200).json({
      message: 'OK',
      id: result.rows[0].id,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      password: result.rows[0].password
    });
  });
  /* --------- Below, is receiving datas for a profile page. --------- */
  routers.get('/api/v1/clients/:clientsId/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const sessionId = req.params.sessionId;
    const clientsId = req.params.clientsId;
    // получил seessionID не схожжее с db.sessionId
    const result = await clients(selectOneParamSQL, { table: 'users', column: 'id', value: Number(clientsId) });
    const resp = sendNotFound(res, result.rows);
    if (typeof resp === 'boolean') return;

    /* ---- NOTE ---- */
    if (sessionId !== result.rows[0].session_id) {
      res.status(200).json({
        message: 'OK',
        id: result.rows[0].id,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        password: result.rows[0].password
      });
    } else {
      res.status(200).json({});
    }
    return true;
  });
  routers.get('/api/v1/clients/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const sessionId = req.params.sessionId;
    // получил seessionID не схожжее с db.sessionId
    const result = await clients(selectOneParamSQL, { table: 'users', column: 'session_id', value: sessionId });
    const resp = sendNotFound(res, result.rows);
    if (typeof resp === 'boolean') return;

    res.status(200).json({
      message: 'OK',
      id: result.rows[0].id,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      password: result.rows[0].password
    });
    return true;
  });
  routers.delete('/api/v1/clients/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    /* --------- Below, we is get the data of only single user --------- */
    const sessionId = req.params.sessionId;
    let respArr = await clients(selectOneParamSQL, { table: 'users', column: 'session_id', value: sessionId });
    const answ = sendNotFound(res, respArr.rows);
    if (typeof answ === 'boolean') return;
    const emailId = respArr.rows[0].email_id;
    const userId = respArr.rows[0].id;
    respArr = await clients(selectOneParamSQL, { table: 'friends', column: 'profiles_id', value: emailId });
    if (respArr.rows.length > 0) {
      (respArr.rows).forEach((item: typeof Props) => {
        clients(dropTableLineSQL, { table: 'friends', index: item.id }, false, true);
      });
    };
    respArr = await clients(selectOneParamSQL, { table: 'friends', column: 'friends_id', value: emailId });
    if (respArr.rows.length > 0) {
      (respArr.rows).forEach((item: typeof Props) => {
        clients(dropTableLineSQL, { table: 'friends', index: item.id }, false, true);
      });
    };
    respArr = await clients(selectOneParamSQL, { table: 'ads', column: 'email_id', value: emailId });
    if (respArr.rows.length > 0) {
      (respArr.rows).forEach((item: typeof Props) => {
        clients(dropTableLineSQL, { table: 'ads', index: item.id }, false, true);
      });
    };

    respArr = await clients(dropTableLineSQL, { table: 'users', index: userId }, false, true);
    respArr = await clients(dropTableLineSQL, { table: 'emails', index: emailId }, false, true);
    const props = { message: 'Removed' };
    res.status(200).json(props);

    return true;
  });
  routers.put('/api/v1/clients/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const clientData = req.body;
    const sessionId = req.params.sessionId;
    /* --------- Below, we is get the data of only single user --------- */
    let respArr = await clients(selectOneParamSQL, { table: 'users', column: 'session_id', value: sessionId });
    const answ = sendNotFound(res, respArr.rows);
    if (typeof answ === 'boolean') return;

    sendNotFound(res, respArr.rows);
    respArr = await clients(selectOneParamSQL, { table: 'Emails', column: 'id', value: respArr.rows[0].email_id });
    const answ2 = sendNotFound(res, respArr.rows);
    if (typeof answ2 === 'boolean') return;

    sendNotFound(res, respArr.rows);
    const emailOld = respArr.rows[0].emails;
    respArr = await clients(selectSingleUserSQL, { email: respArr.rows[0].emails });
    const answ3 = sendNotFound(res, respArr.rows);
    if (typeof answ3 === 'boolean') return;

    /* --------- Above, all data we received from one line  --------- */
    const data = respArr.rows[0];
    const props: typeof Props = {
      email: emailOld,
      newEmail: data.emails,
      firstName: data.first_name,
      lastName: data.last_name,
      newPassword: data.password,
      isActive: data.is_active,
      isActivated: data.is_activated,
      sendMessage: data.send_message,
      password: data.password
    };
    // Below is (columnNameArr) a name of keys from the `req.body` (above).
    const columnNameArr: Array<keyof typeof Props> = ['newEmail', 'firstName', 'lastName', 'newPassword'];
    columnNameArr.slice(0).forEach((item) => {
      if ((clientData.typeField).toLowerCase() === 'email') {
        props.newEmail = clientData.newValueofField;
      } else if (((item as string).toLowerCase() === (clientData.typeField).toLowerCase()) &&
        ((clientData.typeField).toLowerCase() !== 'email')) {
        (props[item] as string) = clientData.newValueofField;
      }
    });
    if ((clientData.typeField).toLowerCase() === 'email') {
      await clients(changeEmailSQL, { email: props.email, newEmail: props.newEmail }, false);
      res.status(200).json(props);
      return true;
    }

    await clients(changeValueAllCellSQL, { ...props }, false);
    res.status(200).json(props);
    return true;
  });

  /**
   * This is path for a start/zero/basis authorization's mode.
   */
  routers.post('/api/v1/inlogin/', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const props = {
      message: 'OK',
      sessionId: ''
    };
    /* -------------- This is activation's block ------------------ */
    const clientData = req.body as unknown as typeof propsForClient;
    const cookie = clientData.cookie;

    const statusCode: number = 200;

    /* --------------- That is see the email's id ---------------  */
    const client = new Client({
      user: REACT_APP_POSTGRES_USER,
      host: REACT_APP_POSTGRES_HOST,
      port: REACT_APP_POSTGRES_PORT,
      database: REACT_APP_POSTGRES_DB_NAME,
      password: REACT_APP_POSTGRES_DB_PASS
    });
    client.connect();

    const respArr = await client.query(selectSingleUserSQL({ email: clientData.email }));
    if ((respArr.rows).length === 0) {
      client.end();
      res.status(404).json({ massage: 'Not founded' });
      return false;
    }

    /* This's a password's filter */
    const result = await respArr.rows.filter(((item: typeof propsForClient) => item.password === clientData.password));
    if (result.length === 0) {
      client.end();
      res.status(404).json({ massage: 'Not founded' });
      return false;
    }

    // macking the aictve status in db
    await client.query(changeValueOneCellSQL('Users', 'is_active', result[0].id, true));
    props.sessionId = cookie.sessionId;
    // endMacking the aictve status in db
    if (((result.length === 0) || (typeof (result[0].session_id) === 'string' &&
      (result[0].session_id).length === 0) ||
      result[0].session_id === null)) {
      await client.query(changeValueOneCellSQL('Users', 'session_id', result[0].id, cookie.sessionId));
    } else {
      props.sessionId = result[0].session_id;
    }
    client.end();
    /* --------------- if we is find the use in db ---------------  */

    // Response is sent
    res.status(statusCode).json(props);
  });

  /**
   * From an Authorization's form with the request was received. HEre is \
   * we received the 'sessionId', 'emails', 'password'
   */
  routers.post('/api/v1/inlogin/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const clientData = req.body as unknown as typeof propsForClient;
    const cookie = clientData.cookie;
    const sessionInd = req.params.sessionId;

    const respArr = await clients(selectSingleUserSQL, { email: clientData.email });
    const answ = sendNotFound(res, respArr.rows);
    if (typeof answ === 'boolean') return;
    clients(changeValueOneCellSQL, { tableName: 'users', column: 'session_id', index: respArr.rows[0].id, newValue: sessionInd });

    respArr.rows[0].session_id = sessionInd;
    /* line, bolw is a checker for password */
    const respArr3 = await (respArr.rows).filter(((item: typeof propsForClient) => item.password === clientData.password));

    res.status(200).json({ massage: 'OK', sessionId: sessionInd });
    return false;
  });

  // registration
  routers.post('/api/v1/clients/add/', async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<void> => {
    const clientData = req.body as unknown as typeof propsForClient;
    const props = {
      email: clientData.email,
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      passwords: clientData.passwords
    };
    let statusCode: number = 200;
    let statusText = 'Client added successfully';
    try {
      const result = await checkerDubleEmails(clientData.email);
      if (result) {
        statusCode = 404;
      }

      const response = await clients(addNewLineSQL, props); // Returns: propsForClient[]/false

      if (!response) {
        statusCode = 404;
      }
    } catch (err: unknown) {
      statusCode = 404;
      statusText = `Client do not be added! ERROR -> ${(err as ErrorEvent).message} `;
    } finally {
      res.status(statusCode).json({
        message: statusText
      });
    }
  });

  routers.get('/ectivate/:token', (req: Request, res: Response) => {
    // try { Для отправки токена на почту для активизации
    //   const { token } = req.params;
    //   const newUser = jwt.verify(token, process.env.ACTIVATION_SECRET);
    //   const props = { email: newUser.email }
    //   const testResponce = await clients((props: unknown) => { }, props) // ????
    //   //   // Найдите пользователя по email
    //   //   const user = await User.findOne({ email: newUser.email });
    //   if (!testResponce) {
    //     return res.status(400).send('Invalid token.');
    //   }
    //   const prop = {
    //     table: 'Users',
    //     title: 'is_activated',
    //     v: true,
    //     email: newUser.email,
    //     clt: clients
    //   };
    //   await reactivatorForUser(prop);
    //   log('[server -> router]: Email verified successfully. You can now log in.');
    //   res.send('Email verified successfully. You can now log in.');

    //   //   res.send('Email verified successfully. You can now log in.');
    // } catch (error) {
    //   log('[server -> router]: Error verifying email:', error);
    //   console.error('Error verifying email:', error);
    //   res.status(500).send('Error verifying email');
    // }
  });
  return routers;
}
