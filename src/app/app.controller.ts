import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';
import { CreateSnapshotDto } from 'src/snapshots/dto/createSnapshot.dto';
import { SnapshotDocSchema } from 'src/snapshots/entities/snapshot.entity';
import { SnapshotsService } from 'src/snapshots/snapshots.service';
import { AppService } from './app.service';

@Controller()
@ApiTags('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private snapshotsService: SnapshotsService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'A simple greeting for this API',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('crawl')
  @ApiOkResponse({
    description: 'Returns snapshot created',
    schema: SnapshotDocSchema,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - e.g. url was not found',
  })
  crawl(@Body() createSnapshotDto: CreateSnapshotDto) {
    return this.snapshotsService.create(createSnapshotDto);
  }
}
