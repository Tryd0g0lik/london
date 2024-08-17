const { Client } = require('pg');
const { selectAllEmail } = require('../sql-functions');

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
export async function helper(email: string, clt: typeof Client): Promise<NewSqlLine[]> {
  const emailsArr = await clt.query(selectAllEmail());
  console.log('emailsArr: ', emailsArr);
  const result = await emailsArr.rows.filter(((item: { emails: string }) => item.emails === email));
  return result;
}
// Проверит emails на дубли.
// true - найден дубль
//  false - не найден дубль
export const checkerDubleEmails = async (email: string, clt: typeof Client): Promise<boolean> => {
  const result = await helper(email, clt);
  if (result.length < 1) {
    return false;
  }
  return true;
};
