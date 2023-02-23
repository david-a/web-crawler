import {
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  IsDate,
  IsDateString,
} from 'class-validator';

export class ListSnapshotsDto {
  @IsOptional()
  @IsIn(['url', 'createdAt'])
  orderBy: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderDirection: 'ASC' | 'DESC';

  // FILTERS
  @IsOptional()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsDateString()
  createdBefore: Date;

  @IsOptional()
  @IsDateString()
  createdAfter: Date;
}
