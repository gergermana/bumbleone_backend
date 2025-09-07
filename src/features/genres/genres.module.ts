import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { CaslModule } from 'src/casl/casl.module';
import { AdminGenresController } from './admin.genres.controller';

@Module({
  imports: [CaslModule],
  controllers: [GenresController, AdminGenresController],
  providers: [GenresService],
  exports: [GenresService],
})
export class GenresModule {}
