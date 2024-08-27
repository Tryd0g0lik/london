const http_ = require('http');
const cors = require('cors');
const express = require('express');
const { getRouter } = require('./router');
const { prymaryInstalation } = require('./installation');
const REACT_APP_SERVER_PORT = (process.env.REACT_APP_SERVER_PORT as string | unknown) || 7070;
const REACT_APP_POSTGRES_HOST_ = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const app = express();
/** DB */
// Устанавливаем базу данных. Закомментировано СПЕЦИАЛЬНО
prymaryInstalation();

// Middleware для обработки JSON
app.use(cors());
app.use(express.json());

const fortune = (res: typeof http_.request,
  body: string = '',
  statusCode: number = 200): void => {
  void new Promise<void>((resolve, reject) => {
    res.status(statusCode).json(body);
    resolve();
  });
};

async function getPathOfrouter(): Promise<void> {
  app.use('/', await getRouter(app));
};
void getPathOfrouter();

app.listen(REACT_APP_SERVER_PORT, () => {
  console.log(`[server -> listen]: Server start to listen the PORT ${REACT_APP_SERVER_PORT as string}`);
});
