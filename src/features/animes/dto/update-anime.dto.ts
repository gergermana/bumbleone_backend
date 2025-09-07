import { z } from 'zod/v3';
import { createAnimeSchema } from './create-anime.dto';

export const updateAnimeSchema = createAnimeSchema.partial();
export type UpdateAnimeDto = z.infer<typeof updateAnimeSchema>;
    