import { EntryStatus, EntryType, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const generateSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

export async function EntriesSeeder() {
    console.log("Entry seeding started...");

    // const genres = await prisma.genre.findMany();
    // const studios = await prisma.studio.findMany();

    for(let i = 0; i < 50; i++){
        const title = faker.commerce.productName();
        const slug = generateSlug(title) + '-' + faker.number.int({ min: 1, max: 9999 });

        await prisma.entry.create({
            data: {
                franchiseId: faker.number.int({ min: 1, max: 30 }),
                sortOrder: faker.number.int({ min: 1, max: 5 }),
                slug,
                englishTitle: title,
                status: faker.helpers.arrayElement(Object.values(EntryStatus)),
                type: faker.helpers.arrayElement(Object.values(EntryType)),
                description: faker.lorem.paragraph(),
                posterUrl: faker.image.urlPicsumPhotos({ width: 200, height: 300 }),
                bannerUrl: faker.image.urlPicsumPhotos({ width: 300, height: 200 }),

                // genres: {
                //     connect: faker.helpers
                //         .shuffle(genres)
                //         .slice(0, faker.number.int({ min: 1, max: 3 }))
                //         .map((genre) => ({ id: genre.id }))
                // },

                // studios: {
                //     connect: faker.helpers
                //         .shuffle(studios)
                //         .slice(0, faker.number.int({ min: 1, max: 2 }))
                //         .map((studio) => ({ id: studio.id })),
                // },
            },
        });
    }
    
    console.log("Entry seeding done.");
}