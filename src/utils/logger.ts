/** @todo log windston 작성할 것 */

import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import config from "../config";

const logDir = "logs";

const logFormat = winston.format.printf((info) => {
  return `${info.timestamp} ${info.level} : ${info.message}`;
});

const aeccessLogFormat = winston.format.printf(
  (info) => `${info.timestamp}: ${info.message}`
);

const loggerConsole = new winston.transports.Console({ format: logFormat });

const loggerInfoFile = new winstonDaily({
  level: "debug",
  datePattern: "YYYY-MM-DD",
  dirname: logDir,
  filename: `%DATE%.log`, // file 이름 날짜로 저장
  maxFiles: "1d", // 30일치 로그 파일 저장
  zippedArchive: true,
  maxSize: "20m",
});

// error 레벨 로그를 저장할 파일 설정
const loggerErrorFile = new winstonDaily({
  level: "error",
  datePattern: "YYYY-MM-DD",
  dirname: logDir + "/error", // error.log 파일은 /logs/error 하위에 저장
  filename: `%DATE%.error.log`,
  maxFiles: "1d",
  zippedArchive: true,
  maxSize: "20m",
});

const loggerAuccessFile = new winstonDaily({
  level: "alert",
  datePattern: "YYYY-MM-DD",
  dirname: logDir + "/alert", // error.log 파일은 /logs/error 하위에 저장
  filename: `%DATE%.access.log`,
  maxFiles: "1d",
  zippedArchive: true,
  maxSize: "20m",
});

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    logFormat
  ),
  transports: [loggerConsole, loggerInfoFile, loggerErrorFile],
});

const auccessLogger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    aeccessLogFormat
  ),
  transports: [loggerAuccessFile],
});

const stream = {
  write: (message: string) => {
    auccessLogger.alert(message);
  },
};

export default logger;
export { stream };
