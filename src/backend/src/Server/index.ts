const http_ = require('http');
const cors = require('cors');
const express = require('express');
const { getRouter } = require('./router');
// const pg_ = require('pg');
const log = require('./logs/index');
const { prymaryInstalation } = require('./installation');
const REACT_APP_SERVER_PORT = (process.env.REACT_APP_SERVER_PORT as string | unknown) || 7070;
const REACT_APP_POSTGRES_HOST_ = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const app = express();
/** DB */
prymaryInstalation(); // Устанавливаем базу данных. Закомментировано СПЕЦИАЛЬНО

// Middleware для обработки JSON
app.use(cors());
app.use(express.json());

const fortune = (res: typeof http_.request,
  body: string = '',
  statusCode: number = 200): void => {
  void new Promise<void>((resolve, reject) => {
    log(`[server -> fortune]: STATUS ${res.response.status}
      BODY ${res.response.bpdy}`);
    res.status(statusCode).json(body);
    resolve();
  });
};

const router = getRouter(app);
app.use('/', router);

app.listen(REACT_APP_SERVER_PORT, () => {
  log(`[server -> listen]: Server starte to listen the PORT ${REACT_APP_SERVER_PORT as string}`);
});
