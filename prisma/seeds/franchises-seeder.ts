import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const generateSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

export async function FranchisesSeeder() {
    console.log("Franchise seeding started...");

    for(let i = 0; i < 30; i++){
        const title = faker.commerce.productName();
        const slug = generateSlug(title) + '-' + faker.number.int({ min: 1, max: 9999 });

        await prisma.franchise.create({
            data: {
                title,
                originalTitle: title,
                slug,
                startYear: faker.number.int({ min: 1990, max: 2025 }),
                endYear: faker.number.int({ min: 1990, max: 2025 }),
            },
        });
    }
    
    console.log("Franchise seeding done.");
}