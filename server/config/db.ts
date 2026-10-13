import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

const readyStateMap: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export const getDatabaseStatus = (): {
  state: string;
  readyState: number;
  isConnected: boolean;
  host: string | null;
} => {
  const readyState = mongoose.connection.readyState;
  return {
    state: readyStateMap[readyState] ?? 'unknown',
    readyState,
    isConnected: readyState === 1,
    host: mongoose.connection.host || null,
  };
};

export const connectDB = async (): Promise<typeof mongoose> => {
  // Setup connection event listeners
  mongoose.connection.on('connected', () => {
    logger.info(`MongoDB connected successfully to host: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection lost. Disconnected.');
  });

  try {
    const conn = await mongoose.connect(env.MONGO_URL, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });
    return conn;
  } catch (error) {
    logger.error('Failed to establish MongoDB connection:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close(false);
      logger.info('MongoDB connection closed gracefully.');
    } catch (error) {
      logger.error('Error during MongoDB disconnect:', error);
      throw error;
    }
  }
};
