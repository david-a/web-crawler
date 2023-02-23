import { Injectable } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Please use POST method to crawl a page, or CRUD `/snapshots` to interact with existing records. Please refer to the documentation at `/docs` for more details.';
  }
}
