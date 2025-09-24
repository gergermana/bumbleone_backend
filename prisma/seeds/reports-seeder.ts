// import { PrismaClient } from '@prisma/client';
// import { faker } from '@faker-js/faker';

// const prisma = new PrismaClient();

// export async function ReportsSeeder() {
//     console.log('Report seeding started...');

//     const comments = await prisma.comment.findMany();
//     const users = await prisma.user.findMany();

//     for(const comment of comments){
//         for(const user of users){

//             if (faker.number.int({ min: 1, max: 100 }) > 30) continue;
            
//             const existingReport = await prisma.commentReport.findUnique({
//                 where: {
//                     commentId_userId: {
//                         userId: user.id,
//                         commentId: comment.id
//                     },
//                 },
//             });

//             if (!existingReport) {
//                 await prisma.commentReport.create({
//                     data: {
//                         commentId: comment.id,
//                         userId: user.id,
//                         reason: faker.lorem.sentence(),
//                     },
//                 });
//             }
//         }
//     }

//     console.log('Report seeding done...');
// }