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

export const SnapshotsDocSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '63f75a02a86bcf0aa3803523',
      },
      url: {
        type: 'string',
        example: 'https://www.google.com',
      },
      createdAt: {
        type: 'string',
        example: '2021-03-01T00:00:00.000Z',
      },
      documentTitle: {
        type: 'string',
        example: 'Google',
      },
    },
  },
};
export const SnapshotDocSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      example: '1',
    },
    url: {
      type: 'string',
      example: 'https://www.google.com',
    },
    createdAt: {
      type: 'string',
      example: '2021-03-01T00:00:00.000Z',
    },
    screenshot: {
      type: 'string',
      example: '/tmp/screenshots/1234.png',
      title: 'Screenshot path in the server',
    },
    documentTitle: {
      type: 'string',
      example: 'Google',
    },
    outgoingUrls: {
      type: 'object',
      title: 'Outgoing URLs originating from the crawled page',
      properties: {
        document: {
          type: 'array',
          items: {
            type: 'string',
            example: 'https://www.google.com',
          },
        },
        script: {
          type: 'array',
          items: {
            type: 'string',
            example:
              'https://www.google.com/il/wp-includes/js/jquery/jquery.min.js?ver=3.6.1',
          },
        },
        stylesheet: {
          type: 'array',
          items: {
            type: 'string',
            example:
              'https://www.google.com/il/wp-includes/css/dist/block-library/style-rtl.min.css?ver=6.1.1',
          },
        },
        image: {
          type: 'array',
          items: {
            type: 'string',
            example:
              'https://www.google.com/wp-content/themes/gett/build/images/logo.svg',
          },
        },
        xhr: {
          type: 'array',
          items: {
            type: 'string',
            example:
              'https://www.google.com/il/wp-content/uploads/sites/5/2023/02/homepage-illustration-desktop.json',
          },
        },
        font: {
          type: 'array',
          items: {
            type: 'string',
            example:
              'https://www.google.com/wp-content/themes/gett/build/fonts/graphikgett/GraphikGett-Semibold.woff2',
          },
        },
        fetch: {
          type: 'array',
          items: {
            type: 'string',
            example: 'https://js.nagich.co.il/assets/scripts/locale.js',
          },
        },
        ping: {
          type: 'array',
          items: {
            type: 'string',
            example:
              'https://pagead2.googlesyndication.com/pagead/landing?gcs=G100&gcd=G100&rnd=661027870.1677160927&url=https%3A%2F%2Fwww.google.com%2Fil%2F&gtm=1231512413',
          },
        },
      },
    },
    links: {
      type: 'array',
      title: 'Links (anchor elements) found in the crawled page',
      items: {
        type: 'string',
        examples: ['https://www.example.com', 'https://www.facebook.com'],
      },
    },
    stylesheets: {
      type: 'array',
      title: 'Stylesheets referenced in the crawled page',
      items: {
        type: 'string',
        example:
          'https://www.google.com/il/wp-includes/css/dist/block-library/style-rtl.min.css?ver=6.1.1',
      },
    },
    scripts: {
      type: 'array',
      title: 'Scripts referenced in the crawled page',
      items: {
        type: 'string',
        example:
          'https://www.google.com/il/wp-includes/js/jquery/jquery.min.js?ver=3.6.1',
      },
    },
    metadata: {
      type: 'object',
      title: 'Metadata',
      properties: {
        title: {
          type: 'string',
          example: 'My website',
        },
        description: {
          type: 'string',
          example: 'This is a website description',
        },
        icon: {
          type: 'string',
          example: 'https://www.my-website.com/favicon.ico',
        },
        image: {
          type: 'string',
          example: 'https://www.my-website.com/logo.png',
        },
        author: {
          type: 'string',
          example: 'John Doe',
        },
      },
    },
  },
};
