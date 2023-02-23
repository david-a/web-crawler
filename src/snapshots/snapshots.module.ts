import { Module } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';
import { SnapshotsController } from './snapshots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Snapshot } from './entities/snapshot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Snapshot])],
  controllers: [SnapshotsController],
  providers: [SnapshotsService],
  exports: [SnapshotsService],
})
export class SnapshotsModule {}
