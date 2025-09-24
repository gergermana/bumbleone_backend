import { Injectable } from "@nestjs/common";
import { AbilityBuilder, PureAbility } from "@casl/ability";
import { createPrismaAbility, PrismaQuery } from "@casl/prisma";
import { Role } from "src/common/type/role.enum";
import { Action, AppSubjects } from "./casl.types";

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user?: { sub?: number, userRole?: Role }): AppAbility {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

        if (!user) {
            // can(Action.Read, 'Anime');
            // can(Action.Read, 'Comment');
            return build();
        }

        if (user.userRole === Role.ADMIN) {
            can(Action.Manage, 'all');
        }

        if (user.userRole === Role.MODERATOR) {
            // can(Action.Manage, 'Comment');
            can(Action.Read, "User");
            // can(Action.Mute, "User");
            // can(Action.Ban, "User");
        }

        if (user.userRole === Role.USER) {
            can(Action.Read, 'all');

            can(Action.Create, 'Comment');
            can(Action.Update, 'Comment', { id: user.sub });
            can(Action.Delete, 'Comment', { id: user.sub });
        }

        return build();
    }
}