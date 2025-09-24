import { z } from "zod";
import { createEntrySchema } from './create-entry.dto';

export const updateEntrySchema = createEntrySchema.partial();
export type UpdateEntryDto = z.infer<typeof updateEntrySchema>;