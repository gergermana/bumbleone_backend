import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { GenresModule } from './features/genres/genres.module';
import { StudiosModule } from './features/studios/studios.module';
import { UsersModule } from './features/users/users.module';
import { CommentsModule } from './features/comments/comments.module';
import { EntriesModule } from './features/entries/entries.module';
import { FranchisesModule } from './features/franchises/franchises.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    GenresModule,
    StudiosModule,
    UsersModule,
    CommentsModule,
    EntriesModule,
    FranchisesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
