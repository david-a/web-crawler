import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { CreateSnapshotDto } from 'src/snapshots/dto/createSnapshot.dto';
import { SnapshotsService } from 'src/snapshots/snapshots.service';
import { AppService } from './app.service';
// import { CrawlDto } from '../snapshots/dto/crawl.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private snapshotsService: SnapshotsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('crawl')
  crawl(@Body() createSnapshotDto: CreateSnapshotDto) {
    return this.snapshotsService.create(createSnapshotDto);
  }
}
