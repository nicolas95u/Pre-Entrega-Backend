const winston = require('winston');
const path = require('path');

const customLevels = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: 'blue',
    http: 'magenta',
    info: 'green',
    warn: 'yellow',
    error: 'red',
    fatal: 'bold red',
  },
};

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      (info) => `${info.timestamp} [${info.level}]: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/errors.log'),
      level: 'error',
    }),
  ],
});

winston.addColors(customLevels.colors);

module.exports = logger;
