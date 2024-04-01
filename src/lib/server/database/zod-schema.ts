import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
    // Refine is used to add custom validation to the schema, in this case, we are checking if the password and confirmPassword fields match
    // By passing in data sent from the form, we can compare the two fields
    // the path property is used to specify the fields that are being compared and customizes the error path to further help with debugging
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword', 'password']
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export const emailVerificationCode = z.object({
    verificationCode: z.string().min(8)
})


export type RegisterSchema = typeof registerSchema;
export type LoginSchema = typeof loginSchema;