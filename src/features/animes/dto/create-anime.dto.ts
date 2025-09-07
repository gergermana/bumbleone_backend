import { z } from 'zod/v3';
import { optionalIntegerNumber, optionalString, optionalStringArray, requiredString, requiredEnum, requiredUrl, requiredNumberArray } from 'src/common/zod-helper';
import { AnimeType } from '@prisma/client';
import { AnimeStatus } from '@prisma/client';

export const createAnimeSchema = z.object({
    anilistId: optionalIntegerNumber('AnilistID'),
    franchiseKey: optionalString('FranchiseKey'),
    franchiseOrder: optionalIntegerNumber('FranchiseOrder'),
    titleEnglish: requiredString('TitleEnghish'),
    slug: requiredString('Slug'),
    titleJapanese: optionalString('TitleJapanese'),
    titleAlternative: optionalStringArray('TitleAlternative'),
    aired: optionalString('Aired'),
    premiered: optionalString('Premeiered'),
    animeType: requiredEnum(AnimeType, 'Anime Type'),
    animeStatus: requiredEnum(AnimeStatus, 'AnimeStatus'),
    coverImg: requiredUrl('CoverImage'),
    bannerImg: requiredUrl('BannerImage'),
    overview: optionalString('Overview'),
    genres: requiredNumberArray('Genre'),
    studios: requiredNumberArray('Studio'),
});

export type CreateAnimeDto = z.infer<typeof createAnimeSchema>;
