import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

const {
  PROD_DB_HOST,
  PROD_DB_PORT,
  PROD_DB_NAME,
  PROD_DB_USER,
  PROD_DB_PASSWORD,
} = process.env;

console.log(PROD_DB_HOST, PROD_DB_PORT, PROD_DB_NAME, PROD_DB_USER, PROD_DB_PASSWORD);

async function dbPool() {
  try {
    const connection = await mysql.createConnection({
      host: PROD_DB_HOST,
      port: PROD_DB_PORT,
      user: PROD_DB_USER,
      database: PROD_DB_NAME,
      password: PROD_DB_PASSWORD,
    });
    return connection;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

export default dbPool;
