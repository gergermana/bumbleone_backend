import { Prisma } from "@prisma/client";

export function getStudiosOrderBy(sorting?: string): Prisma.StudioOrderByWithRelationInput {
    if (!sorting) {
        return { id: "asc" };
    }

    if (sorting === "LATEST") {
        return { id: "desc" };
    }

    if (sorting === "OLDEST") {
        return { id: "asc" };
    }

    if (sorting === "A_TO_Z") {
        return { name: "asc" };
    }

    if (sorting === "Z_TO_A") {
        return { name: "desc" };
    }

    return { id: "asc" };
}