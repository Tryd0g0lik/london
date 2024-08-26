const log = require('../logs/index');
const { Put, Propse, NewSqlLine } = require('../interfaces');

export function createDatebase(): string {
  return 'CREATE DATABASE london OWNER postgres;';
};

export function createTebleEmailsSQL(): string {
  const createTEmails: string = `
    CREATE TABLE IF NOT EXISTS emails (
      id SERIAL PRIMARY KEY,
      emails VARCHAR(50) NOT NULL UNIQUE,
      activated BOOLEAN DEFAULT FALSE);`;
  return createTEmails;
};

export function createAddFriendsSQL(): string {
  const getFriebds: string = `
    CREATE TABLE IF NOT EXISTS friends (
      id SERIAL PRIMARY KEY,
      links VARCHAR(50) NOT NULL UNIQUE,
      profiles_id INTEGER NOT NULL,
      friends_id INTEGER NOT NULL,
      FOREIGN KEY (profiles_id) REFERENCES users(id),
      FOREIGN KEY (friends_id) REFERENCES users(id),
      UNIQUE (profiles_id, friends_id)
    );`;
  return getFriebds;
};

/**
 * @param email_id: integer is the table emails's id.
 * @param first_name: string. It has default value  'NULL'.
 * @param last_name: string. It's  'NOT NULL'.
 * @param is_active: boolean. It has default value  'false'. User's status is
 * active (it's value the true) or not.
 * @param is_activated: boolean. It has default value  'false'. User's account is
 * activated (it's values the true) or not
 * @param send_message: boolean. It has default value  'false'. Sent  message to the user's email for a activation.
 * @returns
 */
export function createTebleUsersSQL(): string {
  const creeateTUsers = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email_id INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (email_id) REFERENCES emails(id),
    first_name VARCHAR(30) DEFAULT NULL,
    last_name VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    is_authenticated BOOLEAN DEFAULT FALSE,
    is_activated BOOLEAN DEFAULT FALSE,
    send_message BOOLEAN DEFAULT FALSE,
    password VARCHAR(150) NOT NULL,
    session_id VARCHAR(150) UNIQUE
    );`;
  return creeateTUsers;
}

export function createTableAdsSQL(): string {
  const tableAds = `CREATE TABLE IF NOT EXISTS ads (
  id SERIAL PRIMARY KEY,
  email_id INTEGER NOT NULL,
  FOREIGN KEY (email_id) REFERENCES emails(id),
  titles VARCHAR(50) DEFAULT NULL);`;
  return tableAds;
}

// module.exports = { createDatebase, createTebleEmails, createTebleUsers };

export function addNewLineSQL(props: typeof NewSqlLine): string {
  const {
    email,
    firstName,
    lastName,
    passwords
  } = props;
  const createNewLine = `
    WITH new_email AS (
      INSERT INTO Emails (
        id, emails, activated
      )
      values (
        DEFAULT,
        '${email}',
        DEFAULT
      )
      RETURNING id
    )
    INSERT INTO Users (id, email_id, first_name, last_name, is_active, is_activated, send_message, password, session_id )
    values (
      default,
      (select id from new_email),
      '${firstName}',
      '${lastName}',
      default,
      default,
      default,
      '${passwords}',
      default
    );`;
  return createNewLine;
}

/**
 *
 * @returns
 */
export function selectAllEmail(): string {
  const selectElmails = 'SELECT emails FROM Emails';
  return selectElmails;
}

/**
 * У нас есть email, надо получить пользователя
 * @param email: string
 */
export function selectSingleUserSQL(props: typeof Put): string {
  const selectEmailId = `WITH user_email AS (
    SELECT id FROM emails WHERE emails = '${props.email}'
    )
    SELECT * FROM users WHERE email_id = (SELECT id FROM user_email);`;
  return selectEmailId;
}

export function changeEmailSQL(props: typeof Put): string {
  const { email, newEmail } = props;
  const changeEmail = `UPDATE Emails
SET emails = '${newEmail}'
WHERE emails = '${email}';`;
  return changeEmail;
}
/**
 *
 * @param props
 * @param email: string
 * @param emailId: number
 * @param newEmail: string
 * @param firstName: string
 * @param lastName: string
 * @param newPassword: string
 * @returns return string
 */
export function changeValueAllCellSQL(props: typeof Put): string {
  const {
    email,
    isActive = false,
    isActivated = false,
    sendMessage = false,
    firstName, lastName,
    newPassword
  } = props;
  const changeValueAll = `UPDATE Users
SET first_name =  '${firstName}',
    last_name = '${lastName}',
    is_active = ${isActive},
    is_activated = ${isActivated},
    send_message = ${sendMessage},
    password = '${newPassword}'
WHERE email_id = (SELECT id FROM Emails WHERE emails = '${email}');`;
  return changeValueAll;
}

/**
 * Sitantax: `clients(selectOneParamSQL, { column: 'session_id', value: params.sessionId })`
 * @param column : cell
 * @param value : value
 * @returns single object
 */
export function selectOneParamSQL(props: typeof Propse): string {
  const selectOneParam = `SELECT * FROM ${props.table} WHERE  ${props.column} = '${props.value}';`;
  return selectOneParam;
}

/**
 * @param tableName Таблица в которой менять
 * @param column Колонка в которой ячейка для действий
 * @param index Пользователь/строка по которой ячейка
 * @param newValue Новые данные для внесения
 * @returns string
 */
export function changeValueOneCellSQL(tableName: string, column: string, index: number, newValue: string | boolean): string {
  if ((typeof newValue) === 'boolean') {
    const updateOneCell = `UPDATE ${tableName}
    SET ${column} = ${newValue}
    WHERE id = ${index};`;
    return updateOneCell;
  };
  log(`[server -> sql]: inlogin Filter SQL4 =>: ${newValue}`);
  const updateOneCell = `UPDATE ${tableName}
    SET ${column} = '${newValue}'
    WHERE id = ${index};`;
  return updateOneCell;
}

export function dropTableLineSQL(props: typeof Put): string {
  log(`[server -> sql]: DELETE SQL1 Index =>: ${props.index}`);
  const removeTable = `DELETE FROM ${props.table} WHERE id = ${props.index} RETURNING *;`;
  log(`[server -> sql]: DELETE SQL2 =>: ${removeTable}`);
  return removeTable;
}
/* --------------- Here is process  ADS-line ------------------ */

/**
 *
 * @param props `{
 *  emailId,
 *   titles,
 *   table
 * }`
 * @returns string
 */
export function addNewAdsLineSQL(props: typeof Put): string {
  const {
    emailsId,
    titles,
    table
  } = props;

  const escapedTitles = titles ? titles.replace(/'/g, "''") : '';
  const createNewLine = `INSERT
  INTO ${table} (id, email_id, titles)
  values (
    default,
    ${emailsId},
    '${escapedTitles}'
  ) RETURNING * ;`;
  return createNewLine;
};

export function changeAdsSQL(props: typeof Put): string {
  const { index, titles } = props;
  const changeEmail = `UPDATE ads
  SET titles = '${titles}'
  WHERE id = '${index}' RETURNING *;`;
  return changeEmail;
};

export function loaderAllProfilesSQL(): string {
  const loaderProfiles = 'SELECT * from users';
  return loaderProfiles;
};

/* ---- Here is add new friend ---- */
export function addNewFriendSQL(props: typeof Put): string {
  const {
    references,
    myId,
    friendId
  } = props;

  const createNewLine = `INSERT
  INTO friends (id, links, profiles_id, friends_id)
  values (
    default,
    '${references}',
    ${myId},
    ${friendId}
  ) RETURNING * ;`;
  return createNewLine;
};
