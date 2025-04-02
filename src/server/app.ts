import { drizzle } from "drizzle-orm/singlestore";
import mysql from "mysql2/promise";
import { env } from "~/env";


const connection = await mysql.createConnection({
  host: env.SINGLESTORE_HOST,
  port: parseInt(env.SINGLESTORE_PORT), // or your actual port
  user: env.SINGLESTORE_USER,
  password: env.SINGLESTORE_PASS,
  database: env.SINGLESTORE_DB_NAME,
  ssl: {
    rejectUnauthorized: true,
  },
});

const db = drizzle(connection);