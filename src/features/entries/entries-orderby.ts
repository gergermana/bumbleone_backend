import { Prisma } from "@prisma/client";

export function getEntriesOrderBy(sorting?: string): Prisma.EntryOrderByWithRelationInput {
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
        return { englishTitle: "asc" };
    }

    if (sorting === "Z_TO_A") {
        return { englishTitle: "desc" };
    }

    return { id: "asc" };
}