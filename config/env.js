import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRY,
  ARCJET_ENV,
  ARCJET_KEY,
  QSTASH_TOKEN,
  QSTASH_URL,
  SERVER_URL,
  EMAIL_PASSWORD,
  EMAIL_FROM,
} = process.env;
