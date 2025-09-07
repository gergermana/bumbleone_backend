import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AnimesModule } from './features/animes/animes.module';
import { GenresModule } from './features/genres/genres.module';
import { StudiosModule } from './features/studios/studios.module';
import { UsersModule } from './features/users/users.module';
import { CommentsModule } from './features/comments/comments.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AnimesModule,
    GenresModule,
    StudiosModule,
    UsersModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
