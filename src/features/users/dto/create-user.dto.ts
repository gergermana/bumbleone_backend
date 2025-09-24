import { z } from 'zod';
import { UserRole, UserStatus } from '@prisma/client';

export const createUserSchema = z.object({
    username: z.string().max(100),
    email: z.string().max(100),
    hashedPassword: z.string().max(255),
    avatarUrl: z.string().max(500).optional().nullable(),
    role: z.enum(UserRole).optional(),
    status: z.enum(UserStatus).optional(),
})

export type CreateUserDto = z.infer<typeof createUserSchema>;