import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword', 'password']
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})


export type RegisterSchema = typeof registerSchema;
export type LoginSchema = typeof loginSchema;