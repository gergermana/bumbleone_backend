import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const generateSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

export async function AnimesSeeder() {
    console.log("Anime seeding started...");

    const genres = await prisma.genre.findMany();
    const studios = await prisma.studio.findMany();

    for(let i = 0; i < 30; i++){
        const title = faker.commerce.productName();
        const slug = generateSlug(title) + '-' + faker.number.int({ min: 1, max: 9999 });

        await prisma.anime.create({
            data: {
                anilistId: faker.number.int({ min: 1, max: 999999 }),
                franchiseKey: faker.word.words(2).replace(/\s/g, ''),
                franchiseOrder: faker.number.int({ min: 1, max: 5 }),
                slug,
                titleEnglish: title,
                titleJapanese: faker.word.words(3),
                titleAlternative: [faker.word.words(2), faker.word.words(3)],
                animeType: faker.helpers.arrayElement(['TV', 'MOVIE', 'OVA', 'SPECIAL', 'SEQUEL']),
                animeStatus: faker.helpers.arrayElement(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'HIATUS']),
                aired: faker.date.past().toDateString(),
                premiered: `${faker.date.past().getFullYear()} - ${faker.location.city()}`,
                overview: faker.lorem.paragraph(),
                coverImg: faker.image.urlPicsumPhotos({ width: 200, height: 300 }),
                bannerImg: faker.image.urlPicsumPhotos({ width: 300, height: 200 }),

                genres: {
                    connect: faker.helpers
                        .shuffle(genres)
                        .slice(0, faker.number.int({ min: 1, max: 3 }))
                        .map((genre) => ({ id: genre.id }))
                },

                studios: {
                    connect: faker.helpers
                        .shuffle(studios)
                        .slice(0, faker.number.int({ min: 1, max: 2 }))
                        .map((studio) => ({ id: studio.id })),
                },
            },
        });
    }
    
    console.log("Anime seeding done.");
}