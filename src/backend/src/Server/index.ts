const http = require('http');
const { Client } = require('pg');
const createTable = require('./sql-functions/index');

const APP_POSTGRES_HOST: string = process.env.APP_POSTGRES_HOST || 'localhost';
const APP_POSTGRES_PORT = process.env.APP_POSTGRES_PORT || '5432';
const APP_POSTGRES_DB_NAME = process.env.APP_POSTGRES_DB_NAME || 'london';
const APP_POSTGRES_DB_PASS = process.env.APP_POSTGRES_DB_PASS || '123';
const APP_SERVER_PORT = process.env.APP_POSTGRES_PORT || '7070';

const client = new Client({
  user: 'postgres',
  host: APP_POSTGRES_HOST,
  port: APP_POSTGRES_PORT,
  database: APP_POSTGRES_DB_NAME,
  password: APP_POSTGRES_DB_PASS
});

async function createDB(): Promise<void> {
  const time = new Date();
  try {
    console.log(`[server -> ${time.getTime()}]: Start creatind  db.`);
    await client.query(createTable.createDatebase());
    console.log(`[server -> ${time.getTime()}]: Created the db.`);
    await client.query(await createTable.createTebleEmails());
    console.log(`[server -> ${time.getTime()}]: Here a table "Emails" was created.`);
    await client.query(await createTable.createTebleUsers());
    console.log(`[server -> ${time.getTime()}]: Here a table "Users" was created.`);
  } catch (err: unknown) {
    console.log(`[server -> ${time.getTime()} createDB]: Something that wrong! ERR-MEASSAGE: ${(err as ErrorEvent).message}`);
  };
};
void createDB();
