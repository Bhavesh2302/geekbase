import { Request, Response } from 'express';
import { getDatabaseStatus } from '../config/db';
import { env } from '../config/env';
import { sendSuccess } from '../utils/apiResponse';

export const getHealthStatus = (_req: Request, res: Response): void => {
  const dbStatus = getDatabaseStatus();
  const uptimeSeconds = Math.floor(process.uptime());
  const memUsage = process.memoryUsage();

  const healthData = {
    status: dbStatus.isConnected ? 'healthy' : 'degraded',
    uptime: `${uptimeSeconds}s`,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: {
      status: dbStatus.state,
      readyState: dbStatus.readyState,
      connected: dbStatus.isConnected,
    },
    system: {
      memory: {
        heapUsedMB: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMB: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100,
        rssMB: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
      },
      nodeVersion: process.version,
    },
  };

  const httpStatus = dbStatus.isConnected ? 200 : 503;
  sendSuccess(res, healthData, 'Health check passed', httpStatus);
};
