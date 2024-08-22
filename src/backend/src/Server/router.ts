const { Router, Application, Request, Response, NextFunction } = require('express');
const { Client } = require('pg');
const { helper } = require('./validators');
const {
  addNewLineSQL, selectSingleUserSQL,
  changeValueOneCellSQL, selectOneParamQSL,
  changeValueAllCellSQL, changeEmailSQL, dropTableLineSQL
} = require('./sql-functions/index');
const log = require('./logs/index');
const { clients } = require('./clients');
const { getCookie } = require('./getCookies');
const { checkerDubleEmails } = require('./validators');
const router = Router();
// const jwt = require('jsonwebtoken'); // для отправки сообщщения на почту
interface propsForClient {
  readonly email: string
  readonly firstName?: string
  readonly lastName?: string
  readonly passwords: string
  password?: string
  cookie?: { sessionId: string }
};
export interface FieldInnerHtml {
  cookie?: string
  text?: string
  dataNamex: string
  typeField?: string
  newValueofField?: string | boolean
};
interface Props {
  email?: string
  emailId?: number
  newEmail?: string
  firstName?: string
  lastName?: string
  newPassword?: string
  isActive?: boolean
  isActivated?: boolean
  sendMessage?: boolean
  password?: string
}
interface ClientData {
  typeField: string
  newValueofField: string
  columnNameArr?: string[]
}

const REACT_APP_POSTGRES_HOST = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const REACT_APP_POSTGRES_PORT = (process.env.REACT_APP_POSTGRES_PORT as string | unknown) || '5432';
const REACT_APP_POSTGRES_DB_NAME = (process.env.REACT_APP_POSTGRES_DB_NAME as string | unknown) || 'london';
const REACT_APP_POSTGRES_USER = (process.env.REACT_APP_POSTGRES_USER as string | unknown) || 'postgres';
const REACT_APP_POSTGRES_DB_PASS = (process.env.REACT_APP_POSTGRES_DB_PASS as string | unknown) || '123';

export function getRouter(appObj: typeof Application): typeof router {
  router.get('/api/v1/clients/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    await log(`[server -> router]: inlogin:sessionId  That request was received from Profile 1 =>: ${req}`);
    const sessionId = req.params.sessionId;
    await log(`[server -> router]: inlogin:sessionId  №1 =>: ${req.params.sessionId}`); // получил seesionID не схожжее с db.seesionId
    const result = await clients(selectOneParamQSL, { table: 'users', column: 'session_id', value: sessionId });
    log(`[server -> router]: inlogin:sessionId  №2 Profile ID =>: ${JSON.stringify(result)}`);
    const resp = sendNotFound(res, result.rows);
    if (typeof resp === 'boolean') return;

    await log(`[server -> router]: inlogin:sessionId №3 That Profile ID =>: ${JSON.stringify(result.rows[0])}`);
    res.status(200).json({
      message: 'OK',
      id: result.rows[0].id,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      password: result.rows[0].password
    });
    await log('[server -> router]: inlogin:sessionId №4 That Profile SENDED');
    return true;
  });
  router.delete('/api/v1/clients/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    await log(`[server -> router]: DELETE  That request was received from Profile =>: ${(req)}`);
    /* --------- Below, we is get the data of only single user --------- */
    const sessionId = req.params.sessionId;
    await log(`[server -> router]: DELETE  №1 Receive data: ${sessionId} => table:'users', column: 'session_id', value: ${sessionId}`);
    let respArr = await clients(selectOneParamQSL, { tableName: 'users', column: 'session_id', value: sessionId });
    await log(`[server -> router]: DELETE  №2: Length => ${JSON.stringify(respArr)}`);
    const answ = sendNotFound(res, respArr.rows);
    if (typeof answ === 'boolean') return;
    const emailId = respArr.rows[0].email_id;
    await log(`[server -> router]: DELETE  №3: Before delete from the "Users" ID => ${respArr.rows[0].id}`);
    respArr = await clients(dropTableLineSQL, 'users', { index: respArr.rows[0].id }, false, [respArr.rows[0].id]);
    await log(`[server -> router]: DELETE  №3.1: Before delete from the "Emails" ID => ${emailId}`);
    respArr = await clients(dropTableLineSQL, { table: 'emails', index: emailId }, false, [respArr.rows[0].id]);
    await log('[server -> router]: DELETE  №4: Removed from the "Users"');
    const props = { message: 'Removed' };
    res.status(200).json(props);

    return true;
  });
  router.put('/api/v1/clients/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    await log(`[server -> router]: PUT  That request was received from Profile 5 =>: ${(req)}`);
    const clientData = req.body as ClientData;
    // await log(`[server -> router]: PUT Body: ${clientData.keys()}`);
    const sessionId = req.params.sessionId;
    await log(`[server -> router]: PUT Body: ${JSON.stringify(clientData)}`);
    /* --------- Below, we is get the data of only single user --------- */
    await log(`[server -> router]: PUT 3: ${sessionId}`);
    let respArr = await clients(selectOneParamQSL, { table: 'users', column: 'session_id', value: sessionId });
    await log(`[server -> router]: PUT Received data of db. Step 1/3. Length =>: ${(respArr.rows).length}`);
    const answ = sendNotFound(res, respArr.rows);
    if (typeof answ === 'boolean') return;

    sendNotFound(res, respArr.rows);
    await log(`[server -> router]: PUT Received data of db. Step 1/3 Email ID =>: ${JSON.stringify(respArr.rows[0])}`);
    respArr = await clients(selectOneParamQSL, { table: 'Emails', column: 'id', value: respArr.rows[0].email_id });
    await log(`[server -> router]: PUT Received data of db. Step 2/3. Length =>: ${(respArr.rows).length}`);
    const answ2 = sendNotFound(res, respArr.rows);
    if (typeof answ2 === 'boolean') return;

    sendNotFound(res, respArr.rows);
    const emailOld = respArr.rows[0].emails;
    await log(`[server -> router]: PUT Received data of db. Step 3/3. =>: ${JSON.stringify(respArr.rows[0])}`);
    respArr = await clients(selectSingleUserSQL, { email: respArr.rows[0].emails });
    const answ3 = sendNotFound(res, respArr.rows);
    if (typeof answ3 === 'boolean') return;

    /* --------- Above, all data we received from one line  --------- */
    const data = respArr.rows[0];
    const props: Props = {
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
    await log(`[server -> router]: PUT Before a change 1/4: ${JSON.stringify(props)}`);
    // Below is (columnNameArr) a name of keys from the `req.body` (above).
    const columnNameArr: Array<keyof Props> = ['newEmail', 'firstName', 'lastName', 'newPassword'];
    columnNameArr.slice(0).forEach((item) => {
      if ((clientData.typeField).toLowerCase() === 'email') {
        props.newEmail = clientData.newValueofField;
      } else if ((item.toLowerCase() === (clientData.typeField).toLowerCase()) &&
        ((clientData.typeField).toLowerCase() !== 'email')) {
        log(`[server -> router]: PUT change 2/4. Item: ${item.toLowerCase()}
        typeField: ${(clientData.typeField).toLowerCase()}`);
        (props[item] as string) = clientData.newValueofField;
        log(`[server -> router]: PUT Now is a change 2/4: ${JSON.stringify(props)}`);
      }
    });
    if ((clientData.typeField).toLowerCase() === 'email') {
      await log(`[server -> router]: PUT After a change 3/4: ${JSON.stringify(props)}
    Before a 'clients'/SQL`);
      await clients(changeEmailSQL, { email: props.email, newEmail: props.newEmail }, false);
      res.status(200).json(props);
      return true;
    }

    await clients(changeValueAllCellSQL, { ...props }, false);
    await log('[server -> router]: PUT After a change 4/4  Before a clients/SQL');
    res.status(200).json(props);
    return true;
  });

  /**
   * This is path fro a start/zero/basis authorization's mode.
   */
  router.post('/api/v1/inlogin/', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    await log(`[server -> router]: inlogin  That request was received from Profile 8 =>: ${req}`);
    const props = {
      message: 'OK',
      sessionId: ''
    };
    /* -------------- This is activation's block ------------------ */
    const clientData = req.body as unknown as propsForClient;
    const cookie = clientData.cookie;
    await log(`[server -> router]: inlogin: ${JSON.stringify(clientData)}`);

    const statusCode: number = 200;
    await log(`[server -> router]: inlogin cookie: ${JSON.stringify(cookie)}`);

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
    await log(`[server -> router]: inlogin Received data where is a length =>: ${(respArr.rows).length}`);
    if ((respArr.rows).length === 0) {
      client.end();
      res.status(404).json({ massage: 'Not founded' });
      return false;
    }
    /* This's a password's filter */
    const result = await respArr.rows.filter(((item: propsForClient) => item.password === clientData.password));
    await log(`[server -> router]: inlogin Filter LENGTH =>: ${(result.length)}`);
    if (result.length === 0) {
      await log(`[server -> router]: inlogin Not found a password. RESULT =>: ${result}`);
      client.end();
      res.status(404).json({ massage: 'Not founded' });
      return false;
    }
    await log(`[server -> router]: inlogin Filter LENGTH2 =>: ${(result.length)}`);
    // making the aictve status in db
    await client.query(changeValueOneCellSQL('Users', 'is_active', result[0].id, true));
    await log(`[server -> router]: inlogin Filter LENGTH3 =>: ${(cookie.sessionId)}`);
    props.sessionId = cookie.sessionId;
    // making the aictve status in db
    if (((typeof (result[0].session_id) === 'string' &&
      (result[0].session_id).length === 0) ||
      result[0].session_id === null)) {
      await client.query(changeValueOneCellSQL('Users', 'session_id', result[0].id, cookie.sessionId));
    } else {
      props.sessionId = result[0].session_id;
    }

    await log(`[server -> router]: inlogin Filter LENGTH4 =>: ${(cookie.sessionId)}`);
    client.end();
    /* --------------- if we is find the use in db ---------------  */

    await log(`[server -> router]: inlogin That User is found: ${result[0].first_name}`);
    await log(`[server -> router]: inlogin That SessionID: ${props.sessionId}`);
    // Response is sent
    res.status(statusCode).json(props);
  });

  /**
   * From an Authorization's form with the request was received.
   */
  router.post('/api/v1/inlogin/:sessionId', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const clientData = req.body as unknown as propsForClient;
    const cookie = clientData.cookie;
    await log(`[server -> router]: inlogin:sessionId: ${JSON.stringify(clientData)}`);

    await log(`[server -> router]: inlogin:sessionId cookie: ${cookie.sessionId} email: ${clientData.email}`);
    const respArr = await clients(selectSingleUserSQL, { email: clientData.email });
    await log(`[server -> router]: inlogin:sessionId №1 Received data where is a length =>: ${(respArr.rows).length}`);
    const answ = sendNotFound(res, respArr.rows);
    if (typeof answ === 'boolean') return;
    await log(`[server -> router]: inlogin:sessionId №1.0  =>: ${JSON.stringify({ tableName: 'users', column: 'session_id', index: respArr.rows[0].id, newValue: cookie.sessionId })}`);
    clients(changeValueOneCellSQL, { tableName: 'users', column: 'session_id', index: respArr.rows[0].id, newValue: cookie.sessionId });
    // const answ2 = sendNotFound(res, respArr2.rows);
    // await log(`[server -> router]: inlogin:sessionId №1.1  =>: ${(respArr2.rows).length}`);
    // await log(`[server -> router]: inlogin:sessionId №1.2  =>: ${JSON.stringify(respArr2.rows[0])}`);
    // if (typeof answ2 === 'boolean') return;
    // const respArr3 = await clients(selectSingleUserSQL, clientData.email);
    respArr.rows[0].session_id = cookie.sessionId;
    await log(`[server -> router]: inlogin:sessionId №2
      Received data where is a length =>: DB.password: ${(respArr.rows[0].password)}
      clientData.password ${clientData.password}`);
    // const answ3 = sendNotFound(res, respArr3.rows);
    // if (typeof answ3 === 'boolean') return;
    const respArr3 = await (respArr.rows).filter(((item: propsForClient) => item.password === clientData.password));
    await log(`[server -> router]: inlogin:sessionId Filter LENGTH =>: ${(respArr3.length)}`);
    await log(`[server -> router]: inlogin:sessionId №2.1 Filter LENGTH =>: ${JSON.stringify(respArr3)}`);
    // const answ4 = sendNotFound(res, respArr3.rows);
    // if (typeof answ4 === 'boolean') return;

    await log(`[server -> router]: inlogin:sessionId №3 Password. RESULT =>: ${JSON.stringify(respArr3)}`);
    res.status(200).json({ massage: 'OK', sessionId: respArr3[0].session_id });
    await log(`[server -> router]: inlogin:sessionId Message was sent a 200code .
      That SessionID: ${respArr3[0].session_id}`);
    return false;
  });
  // router.get('/api/v1/clients/', (req: Request, res: Response) => {
  //   log('[server -> router]: clients');
  //   const body = JSON.stringify({ data: true });
  //   fortune(res, body);
  // });

  // registration
  router.post('/api/v1/clients/add/', async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<void> => {
    await log(`[server -> router]:  That request was received from Profile 8 =>: ${req}`);
    await log(`[server -> router]: clientData 1: ${JSON.stringify(req.body)}`);
    const clientData = req.body as unknown as propsForClient;
    await log(`[server -> router]: clientData: ${JSON.stringify(clientData)}`);
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
      console.log('[[server -> router]: RESULT => ', result);
      if (result) {
        log('[server -> router]: Note: This is email already has.');
        console.log('[server -> router]: Такой ольщователь уже существует');
        statusCode = 404;
      }

      await log('[server -> router]: Before saving into the db');
      const response = await clients(addNewLineSQL, props); // Returns: propsForClient[]/false

      if (!response) {
        await log(`[server -> router]: statusCODE => ${response}`);
        statusCode = 404;
      }
      log('[server -> router]: After saving into the db');
    } catch (err: unknown) {
      statusCode = 404;
      statusText = `Client do not be added! ERROR -> ${(err as ErrorEvent).message} `;
      log(`[server -> router]: Client do not be added ${(err as ErrorEvent).message} `);
    } finally {
      res.status(statusCode).json({
        message: statusText
      });
    }
  });

  router.get('/ectivate/:token', (req: Request, res: Response) => {
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
  return router;
}

/* ------------------------------------------------- */

interface ChengeSingleUser {
  table: string
  title: string
  v: boolean | string
  email: string
  clt: typeof Client
}

/**
 *Для отправки писем
 *  Подаем данные на вход и он меняет true/false or folse/true
* @param table: string - таблица в которой проводить зененияю
* @param title: string - Заголовок колонки которую изменить.
* @param v: boolean | string - Значение для колонки которую изменить.
* @param email: пользователь у которого проводить изменения.
* @param clt 'pg.Client' софт для работы с POSTGRES.
* @param props
* @returns true or false
*/
export async function reactivatorForUser(props: ChengeSingleUser): Promise<boolean> {
  const { table, title, v, email, clt } = props;
  // helper  Возвращает массив с одной строкой/клиентом из таблицы 'Emails'
  let result = await helper(email, clt);

  if (result.length < 1) {
    return false;
  }
  // получили ID-email от почты пользователя
  const userEmailID = result[0].id;
  const selectColumn = `UBDATE ${table}
  SET ${title} = ${v}
  WHERE
  id = ${userEmailID}`;
  try {
    result = await clt.query(selectColumn);
  } catch (err: unknown) {
    // что-то не так с изменением данных (назначение раздела)
    return false;
  }
  return true;
}

/* -------------- */
function sendNotFound(res: typeof Request, rows: unknown): boolean | unknown {
  if ((rows) && (rows as propsForClient[]).length === 0) {
    log('[server -> router]: Not founded - 404 code');
    res.status(404).json({ massage: 'Not founded' });
    return false;
  }
  return rows;
};
