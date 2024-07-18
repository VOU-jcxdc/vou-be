import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, ".env") });

export default new DataSource({
  type: "postgres",
  host: process.env.POSTGRE_HOST,
  port: parseInt(process.env.POSTGRE_PORT as string),
  username: process.env.POSTGRE_USER,
  password: process.env.POSTGRE_PASSWORD,
  database: process.env.POSTGRE_DB,
  migrations: [__dirname + "/src/migrations/*{.ts,.js}"],
});
