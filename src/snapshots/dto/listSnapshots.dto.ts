import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  IsDate,
  IsDateString,
} from 'class-validator';

const ORDER_BY = ['url', 'createdAt'];
const ORDER_DIRECTION = ['ASC', 'DESC'];
export class ListSnapshotsDto {
  @ApiPropertyOptional({
    type: String,
    description: '[SORT] The field to order by',
    default: 'createdAt',
    enum: ORDER_BY,
  })
  @IsOptional()
  @IsIn(ORDER_BY)
  orderBy: string;

  @ApiPropertyOptional({
    type: String,
    description: '[SORT] The order direction (Ascending or Descending)',
    default: 'DESC',
    enum: ORDER_DIRECTION,
  })
  @IsOptional()
  @IsIn(ORDER_DIRECTION)
  orderDirection: 'ASC' | 'DESC';

  // FILTERS
  @ApiPropertyOptional({
    type: String,
    description: '[FILTER] Only return snapshots with certain URL',
    default: 'None (all URLs)',
    example: 'https://google.com',
  })
  @IsOptional()
  @IsUrl()
  url: string;

  @ApiPropertyOptional({
    type: String,
    description:
      '[FILTER] Only return snapshots created BEFORE certain date/datetime',
    default: 'None (all URLs)',
    example: ['2022-08-10', '2023-01-10T10:35:00.000Z'].join(', '),
  })
  @IsOptional()
  @IsDateString()
  createdBefore: Date;

  @ApiPropertyOptional({
    type: String,
    description:
      '[FILTER] Only return snapshots created AFTER certain date/datetime',
    default: 'None (all URLs)',
    example: ['2022-08-10', '2023-01-10T10:35:00.000Z'].join(', '),
  })
  @IsOptional()
  @IsDateString()
  createdAfter: Date;
}
