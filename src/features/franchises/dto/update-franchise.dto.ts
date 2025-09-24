import { z } from 'zod';
import { createFranchiseSchema } from './create-franchise.dto';

export const updateFranchiseSchema = createFranchiseSchema.partial();
export type UpdateFranchiseDto = z.infer<typeof updateFranchiseSchema>;
