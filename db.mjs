import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();
const db = process.env.database;
const host = process.env.host;
const dbport = process.env.dbPort;
const userDB = process.env.user;
const pwDB = process.env.password;

const { Client } = pg;

const client = new pg.Pool({
	database: db,
	host: host,
	port: dbport,
	user: userDB,
	password: pwDB,
});
// to make it async in later use
// .promise();

export default client;
