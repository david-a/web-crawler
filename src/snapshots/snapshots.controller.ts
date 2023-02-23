import {
  Controller,
  Get,
  Param,
  Delete,
  Body,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSnapshotDto } from './dto/createSnapshot.dto';
import { ListSnapshotsDto } from './dto/listSnapshots.dto';
import {
  SnapshotDocSchema,
  SnapshotsDocSchema,
} from './entities/snapshot.entity';
import { SnapshotsService } from './snapshots.service';

@Controller('snapshots')
@ApiTags('Snapshots')
export class SnapshotsController {
  constructor(private readonly snapshotsService: SnapshotsService) {}

  @Post()
  @ApiOkResponse({
    description: 'Returns snapshot created',
    schema: SnapshotDocSchema,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - e.g. url was not found',
  })
  create(@Body() createSnapshotDto: CreateSnapshotDto) {
    return this.snapshotsService.create(createSnapshotDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns snapshot created',
    schema: SnapshotsDocSchema,
  })
  findAll(@Query() listSnapshotsDto: ListSnapshotsDto) {
    return this.snapshotsService.findAll(listSnapshotsDto);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns snapshot',
    schema: SnapshotDocSchema,
  })
  @ApiNotFoundResponse({
    description: 'Snapshot not found with specified id',
  })
  findOne(@Param('id') id: string) {
    return this.snapshotsService.findOne(id);
  }

  // NOTE: no update method, because we don't want to update snapshots

  @Delete(':id') // NOTE: this one is probably should be authorized
  @ApiOkResponse({
    description: 'Empty response',
  })
  @ApiNotFoundResponse({
    description: 'Snapshot not found with specified id',
  })
  remove(@Param('id') id: string) {
    return this.snapshotsService.remove(id);
  }
}
