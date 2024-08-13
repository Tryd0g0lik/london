const http = require('http');
const { Client } = require('pg');
const os = require('os');
const createTable = require('SqlFunctions');

const APP_POSTGRES_HOST = os.getenv('APP_POSTGRES_HOST', 'localhost');
const APP_POSTGRES_PORT = os.getenv('APP_POSTGRES_PORT', '5432');
const APP_POSTGRES_DB_NAME = os.getenv('APP_POSTGRES_DB_NAME', 'london');
const APP_POSTGRES_DB_PASS = os.getenv('APP_POSTGRES_DB_PASS', '123');
const APP_SERVER_PORT = os.getenv('APP_POSTGRES_PORT', '7000');

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
		console.log(`[Server -> ${time.getTime()}]: Start creatind  db.`)
		await client.query(createTable.createTebleEmails);
		console.log(`[Server -> ${time.getTime()}]: Here a table "Emails" was created.`)
		await client.query(createTable.createTebleUsers);
		console.log(`[Server -> ${time.getTime()}]: Here a table "Users" was created.`)
	} catch (err: unknown) {
		console.log(`[Server -> ${time.getTime()} createDB]: Something that wrong! ERR-MEASSAGE: ${(err as ErrorEvent).message}`);
	};

}
