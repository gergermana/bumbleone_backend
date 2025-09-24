import { z } from "zod";

export const createStudioSchema = z.object({
    name: z.string().max(50),
    slug: z.string().max(50),
});

export type CreateStudioDto = z.infer<typeof createStudioSchema>;
