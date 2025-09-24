import { z } from "zod";

export const createFranchiseSchema = z.object({
    title: z.string(),
    originalTitle: z.string(),
    slug: z.string(),
    startYear: z.number().int(),
    endYear: z.number().int(),
});

export type CreateFranchiseDto = z.infer<typeof createFranchiseSchema>;