import mysql from "mysql2/promise"
import { config } from "dotenv"

config()

const {
  TESTING_DB_HOST,
  TESTING_DB_PORT,
  TESTING_DB_NAME,
  TESTING_DB_USER,
  TESTING_DB_PASSWORD,
  DEV_DB_HOST,
  DEV_DB_PORT,
  DEV_DB_NAME,
  DEV_DB_USER,
  DEV_DB_PASSWORD,
  PROD_DB_HOST,
  PROD_DB_PORT,
  PROD_DB_NAME,
  PROD_DB_USER,
  PROD_DB_PASSWORD,
} = process.env

const environments = {
  production: {
    name: PROD_DB_NAME,
    user: PROD_DB_USER,
    password: PROD_DB_PASSWORD,
    host: PROD_DB_HOST,
    port: PROD_DB_PORT,
  },
  testing: {
    name: TESTING_DB_NAME,
    user: TESTING_DB_USER,
    password: TESTING_DB_PASSWORD,
    host: TESTING_DB_HOST,
    port: TESTING_DB_PORT,
  },
  development: {
    name: DEV_DB_NAME,
    user: DEV_DB_USER,
    password: DEV_DB_PASSWORD,
    host: DEV_DB_HOST,
    port: DEV_DB_PORT,
  },
}

const NODE_ENV = "production"

const selectedEnvironment = environments[NODE_ENV]
console.log(selectedEnvironment)

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({})
    console.log("Connected to database successfully!")
    return connection
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw error
  }
}

export default connectToDatabase
