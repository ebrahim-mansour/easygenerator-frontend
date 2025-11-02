import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Email must be a valid email address'),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one letter, one number, and one special character',
    ),
});

export const signinSchema = z.object({
  email: z.string().email('Email must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;

