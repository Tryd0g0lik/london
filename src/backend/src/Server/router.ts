const { Router, Application, Request } = require('express');
const { helper } = require('./validators');
const { routerClients } = require('./routers/clients');
const { routerClientsAds } = require('./routers/clientsAds');
const { routerFriends } = require('./routers/friends');
const { ChengeSingleUser } = require('./interfaces');

let router = Router();

export async function getRouter(appObj: typeof Application): Promise<typeof router> {
  router = await routerClients(router);
  router = await routerClientsAds(router);
  router = await routerFriends(router);
  return router;
}

/* ------------------------------------------------- */
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
export async function reactivatorForUser(props: typeof ChengeSingleUser): Promise<boolean> {
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
