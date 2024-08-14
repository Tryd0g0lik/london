const http = require('http');
const pg = require('pg');
const { createDatebase, createTebleEmails, createTebleUsers } = require('./sql-functions/index');
const lg = require('./logs/index');

const APP_POSTGRES_HOST = (process.env.APP_POSTGRES_HOST as string | unknown) || 'localhost';
const APP_POSTGRES_PORT = (process.env.APP_POSTGRES_PORT as string | unknown) || '5432';
const APP_POSTGRES_DB_NAME = (process.env.APP_POSTGRES_DB_NAME as string | unknown) || 'london';
const APP_POSTGRES_USER = (process.env.APP_POSTGRES_USER as string | unknown) || 'postgres';
const APP_POSTGRES_DB_PASS = (process.env.APP_POSTGRES_DB_PASS as string | unknown) || '123';

function envResultBool(): boolean {
  const resultBool = (!(typeof APP_POSTGRES_HOST).includes('string')
    ? false
    : (!(typeof APP_POSTGRES_PORT).includes('string')
      ? false
      : (!(typeof APP_POSTGRES_DB_NAME).includes('string')
        ? false
        : (!(typeof APP_POSTGRES_USER).includes('string')
          ? false
          : (!!(typeof APP_POSTGRES_DB_PASS).includes('string'))
        ))));
  return resultBool;
}

async function connextDB(): Promise<boolean> {
  const trueFalse = envResultBool();
  if (!trueFalse) {
    lg('[server]: "connextDB" ENV-variebles undefined');
    const error = new Error('[server]: "connextDB" ENV-variebles undefined');
    throw error;
  }

  lg('[server]: Start the "Client" connection.');
  const clientDB = await new pg.Client({
    user: APP_POSTGRES_USER,
    password: APP_POSTGRES_DB_PASS,
    host: APP_POSTGRES_HOST,
    port: Number(APP_POSTGRES_PORT),
    database: 'postgres'
  });
  clientDB.connect();

  try {
    const sql = createDatebase();
    const resp = await clientDB.query(sql);
    console.log(`[resp1] ${resp.rows[0].message}`);
    clientDB.end();
    lg('[server]: The end the Client connection.');
    return true;
  } catch (err: unknown) {
    console.log('[server]: ERRRRor1.');
    lg(`[server -> ERROR1]: 'createDBTable' Something that wrong!
     ERR-MEASSAGE: ${(err as ErrorEvent).message}`);

    if (((err as ErrorEvent).message).includes('уже существует')) {
      return true;
    }
    clientDB.end();
    lg('[server]: The end the "Client" connection.');
    lg('[server]: createDBTable returning FALSE.');
    return false;
  }
}

// console.log('[server -> Client]: Start the 'Client' connection.`);

async function createDBTable(): Promise<boolean> {
  const trueFalse = envResultBool();
  if (!trueFalse) {
    lg('[server]: "createDBTable" ENV-variebles undefined');
    const error = new Error('[server]: "connextDB" ENV-variebles undefined');
    throw error;
  }
  lg('[server]: Start the "Client" connection.');
  const client = await new pg.Client({
    user: APP_POSTGRES_USER,
    host: APP_POSTGRES_HOST,
    port: APP_POSTGRES_PORT,
    database: APP_POSTGRES_DB_NAME,
    password: APP_POSTGRES_DB_PASS
  });
  client.connect();
  try {
    await client.query(createTebleEmails());
    lg('[server]: "Emails" created .');
  } catch (err: unknown) {
    lg(`[server -> ERROR]: 'Emails' Something that wrong!
     ERR-MEASSAGE: ${(err as ErrorEvent).message}`);
    console.log(`[Emails!!!] ${((err as ErrorEvent).message).includes('уже существует')}`);
    if (!((err as ErrorEvent).message).includes('уже существует')) {
      lg('[server]: "Emails" returning FALSE.');
      return false;
    }
    lg('[server]: "Emails" was created .');
  };
  try {
    await client.query(createTebleUsers());
    lg('[server]: "Users" created .');
    client.end();
    lg('[server]: The end the "Client" connection.');
    return true;
  } catch (err: unknown) {
    console.log(`[Users!!!] ${('уже существует').includes((err as ErrorEvent).message)}`);
    if (('уже существует').includes((err as ErrorEvent).message)) {
      lg('[server]: "Users" was created .');
      return true;
    }
    lg(`[server -> ERROR]: 'Users' Something that wrong!
     ERR-MEASSAGE: ${(err as ErrorEvent).message}`);
    lg('[server]: "Emails" returning FALSE.');
    return false;
  }
};

async function prymaryInstalation(): Promise<void> {
  lg('[server]: START');
  const resp = await connextDB();
  if (resp) {
    await createDBTable();
    lg('[server]: END');
  }
}
