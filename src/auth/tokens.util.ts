import { User } from '@prisma/client';
import * as crypto from 'crypto';

export const newJti = () => crypto.randomUUID();

export const accessPayload = (user: User) =>
    ({ sub: user.id, email: user.email, userRole: user.userRole });

export const refreshPayload = (userId: number, tokenId: string) => 
    ({ sub: userId, tokenId });