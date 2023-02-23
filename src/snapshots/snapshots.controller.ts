import {
  Controller,
  Get,
  Param,
  Delete,
  Body,
  Post,
  Query,
} from '@nestjs/common';
import { CreateSnapshotDto } from './dto/createSnapshot.dto';
import { ListSnapshotsDto } from './dto/listSnapshots.dto';
import { SnapshotsService } from './snapshots.service';

@Controller('snapshots')
export class SnapshotsController {
  constructor(private readonly snapshotsService: SnapshotsService) {}

  @Post()
  create(@Body() createSnapshotDto: CreateSnapshotDto) {
    return this.snapshotsService.create(createSnapshotDto);
  }

  @Get()
  findAll(@Query() listSnapshotsDto: ListSnapshotsDto) {
    return this.snapshotsService.findAll(listSnapshotsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snapshotsService.findOne(id);
  }

  // NOTE: no update method, because we don't want to update snapshots

  @Delete(':id') // NOTE: this one is probably should be authorized
  remove(@Param('id') id: string) {
    return this.snapshotsService.remove(id);
  }
}
