import { Sequelize } from "sequelize";
import { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } from "./config";

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: "postgres",
  port: 5432,
  host: DB_HOST,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log("db connected");
  } catch (error) {
    console.log("db not connected");
  }
}

main();
