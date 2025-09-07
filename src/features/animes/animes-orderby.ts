import { Prisma } from "@prisma/client";

export function getAnimesOrderBy(sorting?: string): Prisma.AnimeOrderByWithRelationInput {
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
        return { titleEnglish: "asc" };
    }

    if (sorting === "Z_TO_A") {
        return { titleEnglish: "desc" };
    }

    return { id: "asc" };
}