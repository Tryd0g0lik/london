const http_ = require('http');
const pg_ = require('pg');
const log = require('../logs/index');
const APP_SERVER_PORT = (process.env.APP_SERVER_PORT as string | unknown) || 7070;

const fortune = (ctx: typeof http_.request,
  body: string = '',
  status: number = 200): void => {
  void new Promise<void>((resolve, reject) => {
    log(`[server -> fortune]: STATUS ${ctx.response.status}
      BODY ${ctx.response.bpdy}`);
    ctx.writeHead(status, { 'Content-Type': 'application/json' });
    ctx.end(body);
    resolve();
  });
};
const clientsId = new String(/clients\/[0-9]?/);
log(`[server -> clientsId]: ${clientsId as string} `);
async function router(req: typeof http_.request): Promise<void> {
  console.log(`[server -> router]: typeof req <=> ${(typeof req).includes(typeof http_.request)} `);
  if ((typeof req).includes(typeof http_.request)) {
    log(`[server -> router]: ${typeof req} `);
    req.writeHead(500, { 'Content-Type': 'application/json' });
    const body = JSON.stringify({ data: false });
    fortune(req, body, 500);
    log('[server -> router]: Start send data');
  }
  if ((req.url).imvludes('/api/v1/clients/')) {
    log('[server -> router]: get all clients');
  } else if ((req.url).imvludes()) {
    log('[server -> router]: clients/id');
  } else if ((clientsId).includes(req.url as string)) {
    // '/api/v1/patch/clients/id'
    log('[server -> router]: clients/id');
  } else {
    log('[server -> router]: 404 code');
    const body = JSON.stringify({ data: false });
    fortune(req, body, 404);
  }
}
const server = http_.createServer(async (req: unknown, res: unknown) => {
  void router(req);
});

server.listen(APP_SERVER_PORT, () => {
  log(`[server -> listen]: Server starte to listen the PORT ${APP_SERVER_PORT as string}`);
  console.log(`[server]: Server starte to listen the PORT ${APP_SERVER_PORT as string}`);
});
