import { IsUrl } from 'class-validator';

export class CreateSnapshotDto {
  @IsUrl()
  url: string;
}
