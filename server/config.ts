import { config } from "dotenv";

config();

const SECRET = process.env.SECRET;

const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

export {
  SECRET,
  SENDGRID_API_KEY,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
};
