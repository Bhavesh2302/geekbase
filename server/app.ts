import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { logger } from './utils/logger';
import { AppError } from './utils/AppError';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import apiRoutes from './routes';

const app: Application = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS Configuration with explicit allowed origins & credentials
const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    return callback(
      AppError.forbidden(`Origin '${origin}' is not permitted by CORS policy`)
    );
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// 3. Body and Cookie Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 4. Request Logging
app.use(requestLogger);

// 5. API Routes
app.use('/api/v1', apiRoutes);

// 6. 404 Route Catch-all
app.use(notFoundHandler);

// 7. Centralized Error Handler
app.use(errorHandler);

// Server startup & graceful shutdown
export const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start HTTP listener
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Geekbase Server running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
      logger.info(`👉 Health check: http://localhost:${env.PORT}/api/v1/health`);
    });

    const gracefulShutdown = (signal: string) => {
      logger.warn(`Received ${signal}. Starting graceful shutdown...`);

      // Fallback timeout to prevent hanging process
      const forceExitTimer = setTimeout(() => {
        logger.error('Shutdown timed out after 10s. Forcing exit.');
        process.exit(1);
      }, 10000);
      forceExitTimer.unref();

      server.close(async () => {
        logger.info('HTTP server closed. Draining database connections...');
        try {
          await disconnectDB();
          logger.info('All connections terminated successfully. Clean exit.');
          process.exit(0);
        } catch (dbError) {
          logger.error('Error while disconnecting MongoDB:', dbError);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      gracefulShutdown('uncaughtException');
    });

    return server;
  } catch (error) {
    logger.error('Critical failure during server startup:', error);
    process.exit(1);
  }
};

startServer();

export default app;
