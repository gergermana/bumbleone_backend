import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function StudiosSeeder() {
    const studioNames = ['MAPPA', 'Ufotable', 'Wit Studio', 'Bones', 'Toei Animation'];
    console.log("Studio seeding started...")

    for(const name of studioNames){
        await prisma.studio.create({
            data: { name },
        })
    }

    console.log("Studio seeding done.");
}