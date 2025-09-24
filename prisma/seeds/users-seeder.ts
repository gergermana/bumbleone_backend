import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const prisma = new PrismaClient();

export async function UsersSeeder() {
    console.log("User seeding started...");

    for(let i = 0; i < 30; i++) {
        const password = "htoohtoo22";
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const shouldMute = faker.datatype.boolean();
        const shouldBan = faker.datatype.boolean();

        await prisma.user.create({
            data: {
                username: faker.person.fullName(),
                email: faker.internet.email(),
                hashedPassword: hashedPassword,
                avatarUrl: faker.image.avatar(),
                role: faker.helpers.arrayElement(["USER", "ADMIN", "MODERATOR"]),
                status: faker.helpers.arrayElement(["ACTIVE", "DELETED"]),
                mutedUntil: shouldMute ? faker.date.future() : null,
                bannedUntil: shouldBan ? faker.date.future() : null,
            },
        });
    }

    console.log("User seeding done.");
}