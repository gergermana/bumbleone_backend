import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// import { FranchisesSeeder } from "./franchises-seeder";
// import { EntriesSeeder } from "./entries-seeder";
// import { UsersSeeder } from "./users-seeder";
import { GenresSeeder } from "./genres-seeder";
import { StudiosSeeder } from "./studios-seeder";

async function main() {
    try {
        // await FranchisesSeeder();
        // await EntriesSeeder();
        // await UsersSeeder();
        // await GenresSeeder();
        // await StudiosSeeder();
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();