import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { GenresSeeder } from "./genres-seeder";
import { StudiosSeeder } from "./studios-seeder";
import { AnimesSeeder } from "./animes-seeder";
import { EpisodesSeeder } from "./episodes-seeder";
import { UsersSeeder } from "./users-seeder";
import { CommentsSeeder } from "./comments-seeder";
import { ReportsSeeder } from "./reports-seeder";

async function main() {
    try {
        await GenresSeeder();
        await StudiosSeeder();
        await AnimesSeeder();
        await EpisodesSeeder();
        await UsersSeeder();
        await CommentsSeeder();
        await ReportsSeeder();
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();