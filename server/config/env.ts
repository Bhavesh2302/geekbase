import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '../utils/logger';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(8080),
  MONGO_URL: z.string().min(1, 'MONGO_URL is required'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z
    .string()
    .min(8, 'JWT_SECRET must be at least 8 characters long')
    .default('super_secret_dsa_jwt_key_geekbase_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

export type EnvConfig = z.infer<typeof envSchema>;

const validateEnv = (): EnvConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    logger.error('❌ Invalid environment configuration:');
    for (const issue of result.error.issues) {
      const path = issue.path.join('.') || 'root';
      logger.error(`   - ${path}: ${issue.message}`);
    }
    // Fail-fast on startup
    process.exit(1);
  }

  return result.data;
};

export const env = validateEnv();
