import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Accounts",
  password: "12345",
  port: 5432,
});

pool.connect()
  .then(() => console.log(" Connected to PostgreSQL"))
  .catch(err => console.error(" Database connection error", err));

 export default pool;