import { requiredString } from "src/common/zod-helper";
import { z } from "zod/v3";

export const createGenreSchema = z.object({
    name: requiredString("Genre Name"),
});

export type CreateGenreDto = z.infer<typeof createGenreSchema>;
