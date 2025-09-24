import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GenresSeeder() {
    const genreNames = ['Action', 'Drama', 'Fantasy', 'Comedy', 'Romance', 'Sci-Fi', 'Mastery', 'Horror', 'Thriller', 'Sports'];
    console.log("Genre seeding started...");

    for(const name of genreNames){
        await prisma.genre.create({
            data: { 
                name,
                slug: name,
            },
        })
    }

    console.log("Genre seeding done.")
}