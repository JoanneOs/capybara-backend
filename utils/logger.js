import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Express-compatible middleware
const loggerMiddleware = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

export { loggerMiddleware };
export default logger;
