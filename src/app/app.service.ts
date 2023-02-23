import { Injectable } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Please use POST method to crawl a page, or CRUD `/snapshots` to interact with existing records.';
  }

  async crawl(url: string) {
    // return await pageCrawler(url);
    // const snapshotRaw = await pageCrawler(url);
    // if
    //  this.snapshotsService.create(snapshot);
  }
}
