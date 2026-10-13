import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string({ message: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Please provide a valid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password cannot exceed 128 characters'),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Please provide a valid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(1, 'Password is required'),
  }),
};

export type RegisterInput = z.infer<typeof registerSchema.body>;
export type LoginInput = z.infer<typeof loginSchema.body>;
