import { Module } from '@nestjs/common';
import { StudiosService } from './studios.service';
import { StudiosController } from './studios.controller';
import { AdminStudiosController } from './admin.studios.controller';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [
    StudiosController, 
    AdminStudiosController
  ],
  providers: [StudiosService],
  exports: [StudiosService],
})
export class StudiosModule {}
