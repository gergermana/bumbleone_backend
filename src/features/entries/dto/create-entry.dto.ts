import { z } from 'zod';
import { EntryStatus, EntryType } from '@prisma/client';

export const createEntrySchema = z.object({
    franchiseId: z.number().int(),
    sortOrder: z.number().int().optional().nullable(),
    slug: z.string().max(255),
    englishTitle: z.string().max(255),
    romajiTitle: z.string().max(255).optional().nullable(),
    japaneseTitle: z.string().max(255).optional().nullable(),
    synonyms: z.string().max(255).optional().nullable(),
    aired: z.string().max(50).optional().nullable(),
    premiered: z.string().max(50).optional().nullable(),
    duration: z.number().int().optional().nullable(),
    status: z.enum(EntryStatus).optional(),
    type: z.enum(EntryType).optional(),
    description: z.string().optional().nullable(),
    malScore: z.number().optional().nullable(),
    anilistScore: z.number().optional().nullable(),
    posterUrl: z.string().max(500),
    bannerUrl: z.string().max(500).optional().nullable(),
    createdAt: z.coerce.date().optional(),
    genres: z.array(z.number()).optional(),
    studios: z.array(z.number()).optional(),
})

export type CreateEntryDto = z.infer<typeof createEntrySchema>;