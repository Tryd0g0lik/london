const { Router, Application, Request, Response, NextFunction } = require('express');
const { Client } = require('pg');
const { helper } = require('./validators');
const { addNewLine, selectSingleUser, changeValueOneCell } = require('./sql-functions/index');
const log = require('./logs/index');
const { clients } = require('./clients');
const { getCookie } = require('./getCookies');
const router = Router();
// const jwt = require('jsonwebtoken'); // для отправки сообщщения на почту
interface propsForClient {
  readonly email: string
  readonly firstName?: string
  readonly lastName?: string
  readonly passwords: string
  password?: string
  coockie?: { sessionId: string }
};

const REACT_APP_POSTGRES_HOST = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const REACT_APP_POSTGRES_PORT = (process.env.REACT_APP_POSTGRES_PORT as string | unknown) || '5432';
const REACT_APP_POSTGRES_DB_NAME = (process.env.REACT_APP_POSTGRES_DB_NAME as string | unknown) || 'london';
const REACT_APP_POSTGRES_USER = (process.env.REACT_APP_POSTGRES_USER as string | unknown) || 'postgres';
const REACT_APP_POSTGRES_DB_PASS = (process.env.REACT_APP_POSTGRES_DB_PASS as string | unknown) || '123';

export function getRouter(appObj: typeof Application): typeof router {
  router.get('api/v1/clients/:id/', (req: Request, res: Response, next: typeof NextFunction) => { });
  router.delete('api/v1/clients/:id/', function (req: Request, res: Response, next: typeof NextFunction) { });
  router.put('api/v1/clients/:id/', function (req: Request, res: Response, next: typeof NextFunction) { });

  router.post('/api/v1/inlogin/', async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
    const clientData = req.body as unknown as propsForClient;
    const coockie = clientData.coockie;
    await log(`[server -> router]: inlogin: ${JSON.stringify(clientData)}`);

    const statusCode: number = 200;
    await log(`[server -> router]: inlogin coockie: ${coockie.sessionId}`);

    /* --------------- That is see the email's id ---------------  */
    const client = new Client({
      user: REACT_APP_POSTGRES_USER,
      host: REACT_APP_POSTGRES_HOST,
      port: REACT_APP_POSTGRES_PORT,
      database: REACT_APP_POSTGRES_DB_NAME,
      password: REACT_APP_POSTGRES_DB_PASS
    });
    client.connect();
    const respArr = await client.query(selectSingleUser(clientData.email));
    await log(`[server -> router]: inlogin Received data where is a length =>: ${(respArr.rows).length}`);
    await log(`[server -> router]: inlogin Received data where PAssword User =>: ${(clientData.password)}`);
    await log(`[server -> router]: inlogin Received data where ALL DB =>: ${(JSON.stringify(respArr.rows[0]))}`);
    await log(`[server -> router]: inlogin clientData data ALL =>: ${JSON.stringify(clientData)}`);
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
    await client.query(changeValueOneCell('Users', 'is_active', result[0].id, true));
    client.end();
    /* --------------- if we is find the use in db ---------------  */
    const props = {
      message: 'OK',
      sessionId: coockie.sessionId
    };
    await log(`[server -> router]: inlogin That User is found: ${result.firstname}`);
    // Response is sent
    res.status(200).json(props);
  });

  // router.get('/api/v1/clients/', (req: Request, res: Response) => {
  //   log('[server -> router]: clients');
  //   const body = JSON.stringify({ data: true });
  //   fortune(res, body);
  // });

  // registration
  router.post('/api/v1/clients/add/', async (req: typeof Request, res: typeof Response, next: typeof NextFunction): Promise<void> => {
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
      await log('[server -> router]: Before saving into the db');
      const response = await clients(addNewLine, props); // true/false
      await log(`[server -> router]: statusCODE => ${response}`);
      if (!response) {
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
