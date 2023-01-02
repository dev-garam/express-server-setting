import * as dotenv from "dotenv";
dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV || "dev",
  PORT: process.env.PORT || 4000,
  HOST: process.env.HOST || ``,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  morganFormat:
    ":remote-addr - :remote-user :method :url HTTP/:http-version :status - :response-time ms :res[content-length] :user-agent",
  MYSQL: {
    HOST: process.env.DB_HOST || "",
    PORT: Number(process.env.DB_PORT) || 3306,
    USER: process.env.DB_USER || "",
    PASSWORD: process.env.DB_PASSWORD || "",
    DATABASE: process.env.DB_DATABASE || "",
    CONNECTION_POOL_MAX: Number(process.env.MYSQL_CONNECTION_POOL_MAX) || 5,
    CONNECTION_POOL_MIN: Number(process.env.MYSQL_CONNECTION_POOL_MIN) || 0,
  },

  MONGO: {
    HOST: process.env.MONGO_HOST || "mongo",
    PORT: process.env.MONGO_PORT || 27017,
    DATABASE: process.env.MONGO_DATABASE || "schemes",
    USER_NAME: process.env.MONGO_USER_NAME || "schemes",
    PASSWORD: process.env.MONGO_PASSWORD || "",
  },

  SWAGGER: {
    description: process.env.SWAGGER_DESCRIPTION || "dscription",
    title: process.env.SWAGGER_TITLE || "title",
    version: process.env.SWAGGER_VERSION || "1.0.0",
  },
};