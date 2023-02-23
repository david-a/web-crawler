import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CrawlDto } from './dto/crawl.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('crawl')
  crawl(@Body() crawlDto: CrawlDto) {
    return this.appService.crawl(crawlDto.url);
  }
}
