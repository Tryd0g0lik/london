const { Client } = require('pg');
const lg = require('./logs/index');
const { propsForClient } = require('./interfaces');
const { selectOneParamSQL } = require('./sql-functions');
// const { checkerDubleEmails } = require('./validators');

const REACT_APP_POSTGRES_HOST = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const REACT_APP_POSTGRES_PORT = (process.env.REACT_APP_POSTGRES_PORT as string | unknown) || '5432';
const REACT_APP_POSTGRES_DB_NAME = (process.env.REACT_APP_POSTGRES_DB_NAME as string | unknown) || 'london';
const REACT_APP_POSTGRES_USER = (process.env.REACT_APP_POSTGRES_USER as string | unknown) || 'postgres';
const REACT_APP_POSTGRES_DB_PASS = (process.env.REACT_APP_POSTGRES_DB_PASS as string | unknown) || '123';

/**
 *
 * TODO: Клиент - для работы с db. Данный размещаем в строке SQL, через 'client.query'.
 * The entrypoint's sintax `clients(selectSingleUserSQL, clientData.email);`.
 *
 * @params `resp` booolean. Default value is a `true`. It a `true` for a POST, GET requests.
 * If `resp` = false, it's for a PUT requests.
 * @param remove type is 'false'. Default value is a 'false'. Here \
 * a 'true' value for a DELETE request
 * @param fun  This's function. It's returns the string, SQL-request for 'fun'.
 * @param dataJson data in mode to JSON (!!check the all sql-functions by formats from entrypoint).
 * @returns
 */
export async function clients(fun: (props: typeof propsForClient) => boolean,
  dataJson: typeof propsForClient, resp = true, remove = false): Promise<boolean> {
  await lg('[server -> clients]: Before connection.');
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
    await lg(`[server -> clients]: Data: JSON: => ${JSON.stringify(dataJson)}`);
    if (remove) {
      await lg(`[server -> clients]: DELETE data before delete => table ${dataJson.table}; id = ${dataJson.index}; remove: ${remove}`);
      // const result = client.query(selectOneParamSQL({ table: 'friends', column: 'profiles_id', value: Number(clientsId) }));

      await client.query(`DELETE FROM ${dataJson.table} WHERE id = ${dataJson.index} RETURNING *;`);
      await lg('[server -> clients]: DELETE data was delete');
      await client.end();
      return true;
    } else if (resp) {
      // if (resp) {
      await lg(`[server -> clients]: data before saving => ${JSON.stringify(dataJson)}`);
      const response = await client.query(fun(dataJson));
      await lg('[server -> clients]: data was received');
      await client.end();
      return response;
    }
    await client.query(fun(dataJson));
    await lg('[server -> clients]: data was save');
    await client.end();
  } catch (err: unknown) {
    client.end();
    await lg(`[server -> clients]: Here procces do not be connection or save.
      ERROR => ${(err as Error).name}: ${(err as Error).message}`);
    return false;
  };
}
