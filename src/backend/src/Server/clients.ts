const { Client } = require('pg');
const lg = require('./logs/index');
// const { checkerDubleEmails } = require('./validators');
export interface propsForClient {
  readonly email: string
  readonly firstName?: string
  readonly lastName?: string
  passwords?: string
};

const REACT_APP_POSTGRES_HOST = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const REACT_APP_POSTGRES_PORT = (process.env.REACT_APP_POSTGRES_PORT as string | unknown) || '5432';
const REACT_APP_POSTGRES_DB_NAME = (process.env.REACT_APP_POSTGRES_DB_NAME as string | unknown) || 'london';
const REACT_APP_POSTGRES_USER = (process.env.REACT_APP_POSTGRES_USER as string | unknown) || 'postgres';
const REACT_APP_POSTGRES_DB_PASS = (process.env.REACT_APP_POSTGRES_DB_PASS as string | unknown) || '123';

/**
 * Клиент - для работы с db. Данный размещаем в строке SQL, через 'client.query'.
 * The entrypoint's sintax `clients(selectSingleUserSQL, clientData.email);`.\
 * This 'selectSingleUserSQL' is SQL-string from the 'server/sql-functions' and \
 * `dataJson` data mode JSON.
 * @params `resp` booolean. Default value is a `true`. It a `true` for a POST, GET requests.
 * If `resp` = false, it's for a PUT, DELETE requests.
 */
export async function clients(fun: (props: propsForClient) => boolean,
  dataJson: propsForClient, resp = true): Promise<boolean> {
  lg('[server -> clients]: Before connection.');
  const client = new Client({
    user: REACT_APP_POSTGRES_USER,
    host: REACT_APP_POSTGRES_HOST,
    port: REACT_APP_POSTGRES_PORT,
    database: REACT_APP_POSTGRES_DB_NAME,
    password: REACT_APP_POSTGRES_DB_PASS
  });

  try {
    client.connect();
    lg('[server -> clients]: Connection now.');
    await lg('[server -> clients]: That is a connection. Before sending.');
    if (resp) {
      const response = await client.query(fun(dataJson));
      lg('[server -> clients]: data was received');
      client.end();
      return response;
    }
    await client.query(fun(dataJson));
    lg('[server -> clients]: data was save');
    client.end();
  } catch (err: unknown) {
    client.end();
    lg(`[server -> clients]: Here procces do not be connection or save.
      ERROR => ${(err as Error).message}`);
    return false;
  };
}
