import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards, UnauthorizedException, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type Request, type Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtUser } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Req() req: Request, @Res() res: Response) {
        const ip = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'unknown';

        const { accessToken, refreshToken, user } = await this.authService.login(
            req.user,
            ip,
            userAgent,
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })

        setTimeout(() => {
            return res.json({ accessToken, user });
        }, 3000);
        
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        try {
            const { newAccessToken, newRefreshToken, user } = await this.authService.refreshToken(
                req.cookies['refreshToken'],
                req.headers['user-agent'] || '',
                req.ip || req.socket.remoteAddress,
            );

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            });

            return res.json({ accessToken: newAccessToken, user });
        } catch (error) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(
        @Req() req: Request & { user: JwtUser}, 
        @Res() res: Response
    ) {
        if (!req.user) throw new UnauthorizedException();
        const refreshToken = req.cookies['refreshToken'];

        await this.authService.logout(refreshToken);

        res.clearCookie('refreshToken');

        return res.json({ message: "Logged out Successfully." });
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        if (!req.user) throw new UnauthorizedException();
        return req.user;
    }
}
