export function createDatebase(): string {
  return 'CREATE DATABASE london OWNER postgres;';
};

export function createTebleEmails(): string {
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
export function createTebleUsers(): string {
  const creeateTUsers = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email_id INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (email_id) REFERENCES emails(id),
    first_name VARCHAR(30) DEFAULT NULL,
    last_name VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    is_activated BOOLEAN DEFAULT FALSE,
    send_message BOOLEAN DEFAULT FALSE);`;
  return creeateTUsers;
}
// module.exports = { createDatebase, createTebleEmails, createTebleUsers };
interface NewSqlLine {
  email: string
  firstName: string
  lastName: string
};

export function addNewLine(props: NewSqlLine): string {
  const {
    email,
    firstName,
    lastName
  } = props;
  const createNewLine = `
    WITH new_email AS (
      INSERT INTO emails (
        id, emails, activated
      )
      values (
        DEFAULT,
        ${email},
        DEFAULT
      )
      RETURNING id
    )
    INSERT INTO users (id, email_id, first_name, last_name, is_active, is_activated, send_message)
    values (
    default,
    (select id from new_email),
    ${firstName},
    ${lastName},
    default,
    default,
    default
    );`;
  return createNewLine;
}
