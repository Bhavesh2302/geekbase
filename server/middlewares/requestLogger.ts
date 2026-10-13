import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const message = `${req.method} ${req.originalUrl} ${statusCode} - ${duration}ms [IP: ${ip}]`;

    if (statusCode >= 500) {
      logger.error(`[HTTP] ${message}`);
    } else if (statusCode >= 400) {
      logger.warn(`[HTTP] ${message}`);
    } else {
      logger.info(`[HTTP] ${message}`);
    }
  });

  next();
};
