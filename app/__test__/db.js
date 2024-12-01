import mysql from "mysql2/promise"

const connectionConfig = {
  host: "localhost",
  port: 41181,
  user: "root",
  password: "admin",
  database: "smartrecycling",
}

export const createDatabaseConnection = async () => {
  try {
    const connection = await mysql.createConnection(connectionConfig)
    return connection
  } catch (error) {
    console.error("Database connection error:", error.message)
    throw error
  }
}

export const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwZDMwODQ4LTZkYzYtNDYwYi05MGU0LWFiM2YxNmMwNmRmNCIsImlhdCI6MTczMzAzMzkwNywiZXhwIjoxNzMzMDQ0NzA3fQ.s7mPNjM07YGxAE0FpprtjpdTMUdtnDuJ5bEwWIGpZqk"
