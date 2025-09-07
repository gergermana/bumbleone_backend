import { z } from "zod/v3";
import { createStudioSchema } from "./create-studio.dto";

export const updateStudioSchema = createStudioSchema.partial();

export type UpdateStudioDto = z.infer<typeof updateStudioSchema>;
