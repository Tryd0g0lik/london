const log = require('../logs/index');
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

// module.exports = { createDatebase, createTebleEmails, createTebleUsers };
interface NewSqlLine {
  email: string
  firstName: string
  lastName: string
  passwords: string

};

export function addNewLineSQL(props: NewSqlLine): string {
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
export function selectSingleUserSQL(email: string): string {
  const selectEmailId = `WITH user_email AS (
    SELECT id FROM emails WHERE emails = '${email}'
    )
    SELECT * FROM users WHERE email_id = (SELECT id FROM user_email);`;
  return selectEmailId;
}

interface Put {
  email: string
  newEmail: string
  firstName: string
  lastName: string
  newPassword: string
  emailId: number
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
export function changeValueAllCellSQL(props: Put): string {
  const { email, emailId, newEmail, firstName, lastName, newPassword } = props;
  const changeValueAll = `UPDATE Emails
SET emails = '${newEmail}'
WHERE emails = '${email}';

UPDATE Users
SET first_name = '${firstName}',
    last_name = '${lastName}',
    passwords = '${newPassword}',
    email_id = ${emailId}
WHERE email_id = (SELECT id FROM Emails WHERE emails = '${email}');`;
  return changeValueAll;
}

interface Propse {
  column: string
  value: string
  table: 'users' | 'emails'
}
/**
 * Sitantax: `clients(selectOneParamQSL, { column: 'session_id', value: params.sessionId })`
 * @param column : cell
 * @param value : value
 * @returns single object
 */
export function selectOneParamQSL(props: Propse): string {
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
