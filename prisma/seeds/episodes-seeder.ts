import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function EpisodesSeeder() {
    console.log("Episode seeding started...");

    const animes = await prisma.anime.findMany();

    for (const anime of animes) {
        const episodeCount = faker.number.int({ min: 6, max: 24 });

        for (let i = 1; i <=episodeCount; i++) {
            const episode = await prisma.episode.create({
                data: {
                    animeId: anime.id,
                    episodeNumber: i,
                    episodeName: `Episode ${i}: ${faker.word.words(3)}`,
                },
            });

            const sorucesCount = faker.number.int({ min: 1, max: 3 });

            for (let j = 0; j < sorucesCount; j++) {
                await prisma.videoSource.create({
                    data: {
                        episodeId: episode.id,
                        host: faker.internet.domainName(),
                        url: faker.internet.url(),
                    },
                });
            }
        }
    }

    console.log("Episode seeding done.");
}