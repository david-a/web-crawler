import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSnapshotDto {
  @ApiProperty({
    type: String,
    description: 'The URL of the site to be crawled',
    example: 'https://google.com',
  })
  @IsUrl()
  url: string;
}
