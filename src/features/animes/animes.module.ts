import { Module } from '@nestjs/common';
import { AnimesService } from './animes.service';
import { AnimesController } from './animes.controller';
import { AdminAnimesController } from './admin-animes.controller';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [
    AnimesController, 
    AdminAnimesController
  ],
  providers: [AnimesService],
  exports: [AnimesService],
})
export class AnimesModule {}
