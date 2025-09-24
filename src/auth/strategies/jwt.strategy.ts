import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { jwtConstants } from "../constants";
import { UserRole } from "@prisma/client";
import { Request } from "express";

export interface JwtUser {
    id: number,
    email: string,
    userRole: UserRole,
}

function cookieExtractor(req: Request): string | null {
    if (req && req.cookies && req.cookies['access_token']) {
        return req.cookies['access_token'];
    }
    return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                cookieExtractor,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any): Promise<JwtUser> {
        return { id: payload.sub, email: payload.email, userRole: payload.userRole };
    }
}