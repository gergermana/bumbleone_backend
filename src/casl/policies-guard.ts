import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { CHECK_POLICIES_KEY, PolicyHandler } from "./check-policies.decorator";

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private abilityFactor: CaslAbilityFactory,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler());
        if (!policyHandlers) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        const ability = this.abilityFactor.createForUser(user);

        const ok = policyHandlers.every((h) => h(ability));
        if (!ok) throw new ForbiddenException('Insufficient permission');
        return true;
    }
}