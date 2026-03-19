import { z } from 'zod';

const passwordSchema = z.string().min(8, { message: 'Password must be at least 8 characters long' });

export const signinSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: passwordSchema,
});

export const signupSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupSchema = z.infer<typeof signupSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;