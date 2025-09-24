import { Module } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { CaslModule } from 'src/casl/casl.module';
import { AdminEntriesController } from './admin-entries.controller';

@Module({
    imports: [CaslModule],
    controllers: [EntriesController, AdminEntriesController],
    providers: [EntriesService],
    exports: [EntriesService]
})
export class EntriesModule {}
