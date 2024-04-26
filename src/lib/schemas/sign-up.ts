import { z } from 'zod';

export const signUpSchema = z.object({
	displayName: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
});

export type SignUpSchema = typeof signUpSchema;
