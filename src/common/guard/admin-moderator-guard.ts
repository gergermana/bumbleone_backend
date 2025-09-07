import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Role } from "src/common/type/role.enum";

@Injectable()
export class AdminModeratorGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return user && (user.userRole === Role.ADMIN || user.userRole === Role.MODERATOR);
    }
}