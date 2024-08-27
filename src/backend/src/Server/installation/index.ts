const pg = require('pg');
const { createDatebase, createTebleEmailsSQL, createTebleUsersSQL, createTableAdsSQL, createAddFriendsSQL } = require('../sql-functions/index');
const lg = require('../logs/index');

const REACT_APP_POSTGRES_HOST = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const REACT_APP_POSTGRES_PORT = (process.env.REACT_APP_POSTGRES_PORT as string | unknown) || '5432';
const REACT_APP_POSTGRES_DB_NAME = (process.env.REACT_APP_POSTGRES_DB_NAME as string | unknown) || 'london';
const REACT_APP_POSTGRES_USER = (process.env.REACT_APP_POSTGRES_USER as string | unknown) || 'postgres';
const REACT_APP_POSTGRES_DB_PASS = (process.env.REACT_APP_POSTGRES_DB_PASS as string | unknown) || '123';

function envResultBool(): boolean {
  const resultBool = (!(typeof REACT_APP_POSTGRES_HOST).includes('string')
    ? false
    : (!(typeof REACT_APP_POSTGRES_PORT).includes('string')
      ? false
      : (!(typeof REACT_APP_POSTGRES_DB_NAME).includes('string')
        ? false
        : (!(typeof REACT_APP_POSTGRES_USER).includes('string')
          ? false
          : (!!(typeof REACT_APP_POSTGRES_DB_PASS).includes('string'))
        ))));
  return resultBool;
}

async function connextDB(): Promise<boolean> {
  const trueFalse = envResultBool();
  if (!trueFalse) {
    await lg('[server]:  INSTALL "connextDB" ENV-variebles undefined');
    const error = new Error('[server]:  INSTALL "connextDB" ENV-variebles undefined');
    throw error;
  }

  const clientDB = await new pg.Client({
    user: REACT_APP_POSTGRES_USER,
    password: REACT_APP_POSTGRES_DB_PASS,
    host: REACT_APP_POSTGRES_HOST,
    port: Number(REACT_APP_POSTGRES_PORT),
    database: 'postgres'
  });
  await clientDB.connect();
  await lg('[server]:  INSTALL ');
  try {
    const sql = createDatebase();
    const resp = await clientDB.query(sql);
    console.log(`[resp1] ${resp.rows[0].message}`);
    await clientDB.end();
    await lg('[server]:  INSTALL The end the Client connection.');
    return true;
  } catch (err: unknown) {
    console.log('[server]:  INSTALL ERRRRor1.');
    await lg(`[server -> ERROR1]: INSTALL 'createDatebase' Something that wrong!
     ERR-MEASSAGE: ${(err as ErrorEvent).message}`);
    console.log('[server]:  INSTALL ERRRRor1.2.1 ', (String((err as ErrorEvent).message)).includes('уже существует'));
    if ((String((err as ErrorEvent).message)).includes('уже существует')) {
      await lg('[server]:  INSTALL уже существует');
      return true;
    }
    await clientDB.end();
    await lg('[server]:  INSTALL createDBTable returning FALSE.');
    return false;
  }
}

async function createDBTable(): Promise<boolean> {
  const trueFalse = envResultBool();
  if (!trueFalse) {
    await lg('[server]:  INSTALL "createDBTable" ENV-variebles undefined');
    const error = new Error('[server]:  INSTALL "connextDB" ENV-variebles undefined');
    throw error;
  }
  await lg('[server]:  INSTALL Start the "Client" connection.');
  const client = await new pg.Client({
    user: REACT_APP_POSTGRES_USER,
    host: REACT_APP_POSTGRES_HOST,
    port: REACT_APP_POSTGRES_PORT,
    database: REACT_APP_POSTGRES_DB_NAME,
    password: REACT_APP_POSTGRES_DB_PASS
  });
  await client.connect();
  try {
    /* ------ The table Email ------ */
    await client.query(createTebleEmailsSQL());
    await lg('[server]:  INSTALL "Emails" created .');
  } catch (err: unknown) {
    lg(`[server -> ERROR]: 'Emails' Something that wrong!
     ERR-MEASSAGE: ${(err as ErrorEvent).message}`);
    console.log(`[Emails!!!] ${(String((err as ErrorEvent).message)).includes('уже существует')}`);
    if (!(String((err as ErrorEvent).message)).includes('уже существует')) {
      await lg('[server]:  INSTALL "Emails" =>"уже существует"');
    }
    await lg('[server]:  INSTALL "Emails" was created .');
  };

  try {
    /* ------ The table Users ------ */
    await client.query(createTebleUsersSQL());
    await lg('[server]:  INSTALL "Users" created .');
  } catch (err: unknown) {
    if ((String((err as ErrorEvent).message)).includes('уже существует')) {
      await lg('[server]:  INSTALL "Users" =>"уже существует"');
    } else {
      await lg(`[server -> ERROR]: 'Users' Something that wrong!
     ERR-MEASSAGE: ${(err as ErrorEvent).message}`);
    }
  };

  try {
    /* ------ The table Friends ------ */
    await client.query(createAddFriendsSQL());
    await lg('[server]:  INSTALL "Friends" created .');
  } catch (err: unknown) {
    if ((String((err as ErrorEvent).message)).includes('уже существует')) {
      await lg('[server]:  INSTALL "Frineds" =>"уже существует"');
    } else {
      await lg(`[server -> ERROR]: 'Friends' Something that wrong!
     ERR-MEASSAGE: ${(err as ErrorEvent).message}`);
    }
  };

  try {
    /* ------ The table Ads ------ */
    await client.query(createTableAdsSQL());
    await lg('[server]:  INSTALL "ads" created .');
  } catch (err: unknown) {
    console.log(`[ads!!!] INSTALL ${('уже существует').includes((err as ErrorEvent).message)}`);
    if ((String((err as ErrorEvent).message)).includes('уже существует')) {
      await lg('[server]:  INSTALL "ads" =>"уже существует"');
      return true;
    } else {
      await lg(`[server -> ERROR]: INSTALL 'ads' Something that wrong!
     ERR-MEASSAGE: ${(err as ErrorEvent).message}`);
    }
  }
  await client.end();
  return true;
};

export async function prymaryInstalation(): Promise<void> {
  await lg('[server]:  INSTALL START');
  const resp = await connextDB();
  if (resp) {
    await lg('[server]:  INSTALL MIDDLE');
    await createDBTable();
    await lg('[server]:  INSTALL END');
  }
}
