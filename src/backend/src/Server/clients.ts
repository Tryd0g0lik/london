const { Client } = require('pg');
const lg = require('./logs/index');
// const { checkerDubleEmails } = require('./validators');
export interface propsForClient {
  readonly index?: number
  readonly tableName?: string
  readonly email?: string
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
 *
 * TODO: Клиент - для работы с db. Данный размещаем в строке SQL, через 'client.query'.
 * The entrypoint's sintax `clients(selectSingleUserSQL, clientData.email);`.\
 *
 * @params `resp` booolean. Default value is a `true`. It a `true` for a POST, GET requests.
 * If `resp` = false, it's for a PUT requests.
 * @param _ind type is 'null' or 'number'. Default value is a 'null'. Here \
 * a 'number' value for a DELETE request
 * @param fun  This's function. It's returns the string, SQL-request for 'fun'.
 * @param dataJson data in mode to JSON (!!check the all sql-functions by formats from entrypoint).
 * @returns
 */
export async function clients(fun: (props: propsForClient) => boolean,
  dataJson: propsForClient, resp = true, _ind: null | [number] = null): Promise<boolean> {
  lg('[server -> clients]: Before connection.');
  const client = new Client({
    user: REACT_APP_POSTGRES_USER,
    host: REACT_APP_POSTGRES_HOST,
    port: REACT_APP_POSTGRES_PORT,
    database: REACT_APP_POSTGRES_DB_NAME,
    password: REACT_APP_POSTGRES_DB_PASS
  });
  try {
    client
      .on('error', async (err: unknown | Error) => {
        await lg('[server -> clients]: ERROR something bad has happened!', (err as Error).stack);
      });
    client.on('row', async (row: unknown) => {
      await lg(`[server -> clients]: ROW => ${row as string} or ${JSON.stringify(row)}`);
    });
    client.on('end', async () => {
      await lg('[server -> clients]: END');
    });
  } catch (error: unknown | Error) {
    await lg(`[server -> clients]: Error =>  ${(error as Error).message}`);
  }

  try {
    client.connect();
    await lg('[server -> clients]: Connection now. __ ');
    await lg('[server -> clients]: That is a connection. Before sending.');
    await lg(`[server -> router]: Data: JSON: => ${JSON.stringify(dataJson)}`);
    if (_ind !== null) {
      await client.query(`DELETE FROM ${dataJson.tableName} WHERE id = ${dataJson.index} RETURNING *;`, [dataJson.index]);
      lg('[server -> clients]: data was delete');
      client.end();
      return true;
    } else if (resp) {
      // if (resp) {
      const response = await client.query(fun(dataJson));
      await lg('[server -> clients]: data was received');
      client.end();
      return response;
    }
    await client.query(fun(dataJson));
    await lg('[server -> clients]: data was save');
    client.end();
  } catch (err: unknown) {
    client.end();
    await lg(`[server -> clients]: Here procces do not be connection or save.
      ERROR => ${(err as Error).message}`);
    return false;
  };
}
