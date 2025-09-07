import { z } from 'zod/v3';
import { email, optionalUrl, requiredEnum, requiredString } from 'src/common/zod-helper';
import { UserRole } from '@prisma/client';
import { UserStatus } from '@prisma/client';

export const createUserSchema = z.object({
    username: requiredString("Username"),
    email: email('Email'),
    hashedPassword: requiredString("Password"),
    avatarUrl: optionalUrl("AvatarUrl"),
    userRole: requiredEnum(UserRole, "User Role"),
    userStatus: requiredEnum(UserStatus, "User Status")
})

export type CreateUserDto = z.infer<typeof createUserSchema>;