import { Router, Application } from 'express';
const router = Router();
export function getRouter(appObj: Application): typeof router {
  router.get('api/v1/clients/:id/', (req: unknown, res: unknown, next: unknown) => { });
  router.delete('api/v1/clients/:id/', function (req: unknown, res: unknown, next: unknown) { });
  router.put('api/v1/clients/:id/', function (req: unknown, res: unknown, next: unknown) {
    // Установка данных
    appObj.set('myData', { name: 'John', age: 30 });
    // Получение данных из app.set or 'undefined'
    const data = appObj.get('myData');
    // Отправка данных в формате JSON
    // res.json(data);
  });
  router.post('api/v1/clients/', function (req: unknown, res: unknown, next: unknown) { });
  router.get('/api/v1/clients/', (req: unknown, res: unknown) => {
    log('[server -> router]: clients');
    const body = JSON.stringify({ data: true });
    fortune(res, body);
  });
  router.post('/api/v1/clients/add/', () => { });

  return router;
}
