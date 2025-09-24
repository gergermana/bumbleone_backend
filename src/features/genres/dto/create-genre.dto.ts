import { z } from "zod";

export const createGenreSchema = z.object({
    name: z.string().max(50),
    slug: z.string().max(50),
});

export type CreateGenreDto = z.infer<typeof createGenreSchema>;
