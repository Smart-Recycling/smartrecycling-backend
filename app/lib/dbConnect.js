"use strict";

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbPool = () => {
  return mysql.createPool({
    host: "40.90.171.103",
    port: 31520,
    user: "root",
    password: "root",
    database: "smart-recycling-db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

export default dbPool;