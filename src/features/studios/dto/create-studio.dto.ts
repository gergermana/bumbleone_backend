import { requiredString } from "src/common/zod-helper";
import { z } from "zod/v3";

export const createStudioSchema = z.object({
    name: requiredString("Studio Name"),
});

export type CreateStudioDto = z.infer<typeof createStudioSchema>;
