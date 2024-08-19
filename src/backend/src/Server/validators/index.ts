const { Client } = require('pg');
const { selectAllEmail } = require('../sql-functions');

const REACT_APP_POSTGRES_HOST = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const REACT_APP_POSTGRES_PORT = (process.env.REACT_APP_POSTGRES_PORT as string | unknown) || '5432';
const REACT_APP_POSTGRES_DB_NAME = (process.env.REACT_APP_POSTGRES_DB_NAME as string | unknown) || 'london';
const REACT_APP_POSTGRES_USER = (process.env.REACT_APP_POSTGRES_USER as string | unknown) || 'postgres';
const REACT_APP_POSTGRES_DB_PASS = (process.env.REACT_APP_POSTGRES_DB_PASS as string | unknown) || '123';

interface NewSqlLine {
  email: string
  firstName: string
  lastName: string
  passwords: string
};
/**
 * Возвращает массив с одной строкой/клиентом из таблицы 'Emails'
 * @param clt 'pg.Client' софт для работы с POSTGRES.
 * @returns  array
 * '''
 * {
 *  email: string \
 *  firstName: string \
 *  lastName: string \
 *  passwords: string \
 *  };
    ''''
 */
// export async function helper(email: string, clt: typeof Client): Promise<NewSqlLine[]> {
export async function helper(email: string): Promise<NewSqlLine[]> {
  const client = new Client({
    user: REACT_APP_POSTGRES_USER,
    host: REACT_APP_POSTGRES_HOST,
    port: REACT_APP_POSTGRES_PORT,
    database: REACT_APP_POSTGRES_DB_NAME,
    password: REACT_APP_POSTGRES_DB_PASS
  });
  client.connect();
  const emailsArr = await client.query(selectAllEmail());
  console.log('emailsArr: ', emailsArr);
  const result = await emailsArr.rows.filter(((item: { emails: string }) => item.emails === email));
  client.end();
  return result;
}
// Проверит emails на дубли.
// true - найден дубль
//  false - не найден дубль
export const checkerDubleEmails = async (email: string): Promise<boolean> => {
  const result = await helper(email);
  if (result.length < 1) {
    return false;
  }
  return true;
};
