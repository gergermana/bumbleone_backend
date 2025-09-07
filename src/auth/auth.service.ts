import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/features/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { User } from '@prisma/client';
import { accessPayload, newJti, refreshPayload } from './tokens.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { addDays } from 'date-fns';
import { AuthErrorCode } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) {}

    async login(user: any, ip?: string, userAgent?: string): Promise<any> {
        const tokenId = newJti();

        const accessToken = this.jwtService.sign(accessPayload(user), {
            secret: jwtConstants.secret,
            expiresIn: "15m",
        });

        const refreshToken = this.jwtService.sign(refreshPayload(user.id, tokenId), {
            secret: jwtConstants.refreshSecret,
            expiresIn: "7d",
        });

        const userPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            userRole: user.userRole,
            avatarUrl: user.avatarUrl,
        }

        const newExpiresAt = addDays(new Date, 7);

        await this.saveRefreshRecord({ 
            userId: user.id, 
            tokenId: tokenId, 
            rawToken: refreshToken, 
            expiresAt: newExpiresAt, 
            userAgent, 
            ip,
        });

        return { accessToken, refreshToken, user: userPayload };
    }

    async refreshToken(refreshToken: string, userAgent?: string, ip?: string) {
        if (!refreshToken) {
            throw new UnauthorizedException({
                message: "Token not found",
                code: AuthErrorCode.INVALID_REFRESH_TOKEN,
            });
        }

        const decoded = this.decodeRefreshToken(refreshToken);

        const record = await this.prisma.refreshToken.findUnique({ where: { id: decoded.tokenId } });
        if (!record) {
            // await this.prisma.refreshToken.delete({ where: { id: decoded.tokenId } });
            throw new UnauthorizedException({ 
                message: "Refresh token reuse detected",
                code: AuthErrorCode.REFRESH_TOKEN_REUSE,
            });
        }

        const isMatch = await bcrypt.compare(refreshToken, record.hashedToken);
        if (!isMatch) {
            await this.prisma.refreshToken.delete({ where: { id: decoded.tokenId } });
            throw new UnauthorizedException({ 
                message: "Refresh token reuse detected",
                code: AuthErrorCode.REFRESH_TOKEN_REUSE,
            });
        }

        if (record.expiresAt < new Date()) {
            await this.prisma.refreshToken.delete({ where: { id: decoded.tokenId } });
            throw new UnauthorizedException({ 
                message: "Refresh token expired",
                code: AuthErrorCode.REFRESH_TOKEN_EXPIRED,
            });
        }

        const user = await this.prisma.user.findUnique({ where: { id: decoded.sub }});
        if (!user) {
            throw new UnauthorizedException({
                message: "Invalid refresh token",
                code: AuthErrorCode.INVALID_REFRESH_TOKEN,
            });
        }

        await this.prisma.refreshToken.deleteMany({ where: { id: decoded.tokenId } });

        const newTokenId = newJti();
        const newRefreshToken = this.jwtService.sign(refreshPayload(decoded.sub, newTokenId), {
            secret: jwtConstants.refreshSecret,
            expiresIn: Math.floor((record.expiresAt.getTime() - Date.now()) / 1000) + "s",
        });

        await this.saveRefreshRecord({ 
            userId: decoded.sub, 
            tokenId: newTokenId, 
            rawToken: newRefreshToken, 
            expiresAt: record.expiresAt, 
            userAgent, 
            ip 
        });
 
        const newAccessToken = this.jwtService.sign(accessPayload(user), {
            secret: jwtConstants.secret,
            expiresIn: "15m",
        });

        const userPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            userRole: user.userRole,
            avatarUrl: user.avatarUrl,
        }

        return { newAccessToken, newRefreshToken, user: userPayload };
    }

    async logout(refreshToken: string) {
        const decoded = this.decodeRefreshToken(refreshToken);
        await this.prisma.refreshToken.deleteMany({ 
            where: { 
                id: decoded.tokenId,
                userId: decoded.sub,
            },
        });
    }

    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);
        if (!user) return null;

        const hashedPassword = user.hashedPassword;

        const isMatch = await bcrypt.compare(pass, hashedPassword);
        if (!isMatch) return null;

        return user;
    }

    private decodeRefreshToken(refreshToken: string) {
        let decoded: { sub: number, tokenId: string };
        try {
            decoded = this.jwtService.verify<{ sub: number, tokenId: string }>(refreshToken, {
                secret: jwtConstants.refreshSecret,
            });
        } catch (error) {
            throw new UnauthorizedException({
                message: "Invalid refresh token",
                code: AuthErrorCode.INVALID_REFRESH_TOKEN,
            });
        }
        return decoded;
    }

    private async saveRefreshRecord({ userId, tokenId, rawToken, expiresAt, userAgent, ip }: 
        { userId: number, tokenId: string, rawToken: string, expiresAt: Date, userAgent?: string, ip?: string}) {
        const hashedToken = await bcrypt.hash(rawToken, 12);

        await this.prisma.refreshToken.create({
            data: {
                id: tokenId,
                userId,
                hashedToken,
                userAgent: userAgent?.slice(0, 255),
                ip: ip,
                expiresAt,
            }
        })
    }
}