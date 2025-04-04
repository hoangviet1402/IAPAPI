const winston = require("winston");
const { format, transports } = winston;
const DailyRotateFile = require("winston-daily-rotate-file");

// Định dạng log
const logFormat = format.combine(format.timestamp(), format.simple());

// Tạo logger
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: "logs/%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m", // Giới hạn dung lượng file log
      maxFiles: "14d", // Giữ file log trong 14 ngày
    }),
    new transports.Console({ level: "debug" }),
  ],
});

module.exports = logger;
