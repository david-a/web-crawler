import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Snapshot {
  constructor(partial: Partial<Snapshot>) {
    Object.assign(this, partial);
  }

  @ObjectIdColumn()
  _id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  url: string;

  @Column()
  screenshot: string;

  @Column()
  documentTitle: string;

  @Column()
  outgoingUrls: Record<string, string[]>;

  @Column()
  metadata: Record<string, string[] | string>;

  @Column()
  links: string[];

  @Column()
  stylesheets: string[];

  @Column()
  scripts: string[];
}
