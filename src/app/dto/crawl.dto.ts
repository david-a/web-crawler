import { IsUrl } from 'class-validator';

export class CrawlDto {
  @IsUrl()
  url: string;
}
