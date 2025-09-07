if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment variables');
}

export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
}

export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
    NO_REFRESH_TOKEN = 'NO_REFRESH_TOKEN',
    REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
    REFRESH_TOKEN_REUSE = 'REFRESH_TOKEN_REUSE',
}