import mysql from "mysql2/promise";

// Create the connection pool. The pool-specific settings are the defaults
export const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 4306,
  user: "root",
  password: "123456",
  database: "ecommerce_db",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping(); // Sends a ping to the database to check if the connection is alive
    console.log("Database connection successful!");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
