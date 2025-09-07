import { email, requiredString } from 'src/common/zod-helper';
import { z } from 'zod/v3';

export const loginSchema = z.object({
    email: email('Email'),
    password: requiredString('Password'),
})

export type SignInDto = z.infer<typeof loginSchema>;