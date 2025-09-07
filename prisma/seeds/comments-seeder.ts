import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function CommentsSeeder() {
    console.log("Comment seeding started...");

    const episodes = await prisma.episode.findMany();

    for (const episode of episodes) {
        const commentCount = faker.number.int({ min: 4, max: 8 });
        const isReply = faker.datatype.boolean();

        for(let i=0; i < commentCount; i++) {
            await prisma.comment.create({
                data: {
                    episodeId: episode.id,
                    userId: faker.number.int({ min: 1, max: 30 }),
                    content: faker.lorem.sentence(),
                    commentStatus: faker.helpers.arrayElement(["ACTIVE", "DELETED"]),
                }
            })
        }
    }

    console.log("Comment seeding done.");
}