import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { Page } from 'puppeteer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Snapshot } from './entities/snapshot.entity';
import { CreateSnapshotDto } from './dto/createSnapshot.dto';
import { ListSnapshotsDto } from './dto/listSnapshots.dto';

@Injectable()
export class SnapshotsService {
  constructor(
    @InjectRepository(Snapshot)
    private snapshotRepository: Repository<Snapshot>,
  ) {}

  async create(createSnapshotDto: CreateSnapshotDto) {
    let snapshotRaw: Partial<Snapshot>;
    const url = stripUrl(createSnapshotDto.url);
    try {
      snapshotRaw = await pageCrawler(url);
    } catch (error) {
      if (
        error.message.startsWith('net::ERR_NAME_NOT_RESOLVED') ||
        error.message.startsWith('net::ERR_CONNECTION_REFUSED') ||
        error.message.startsWith('net::ERR_CONNECTION_TIMED_OUT') ||
        error.message.startsWith('net::ERR_CONNECTION_CLOSED')
      ) {
        throw new HttpException(
          `Requested URL '${url}' not found`,
          HttpStatus.BAD_REQUEST, // NOT_FOUND is also an option, but more suitable for missing request url than logic error
        );
      }
      throw error;
    }
    const snapshot = new Snapshot(snapshotRaw);
    return this.snapshotRepository.save(snapshot);
  }

  // TODO: pagination
  findAll(listSnapshotsDto: ListSnapshotsDto) {
    const filtersAndSort = prepareFiltersAndSort(listSnapshotsDto);
    return this.snapshotRepository.find({
      select: ['_id', 'url', 'documentTitle', 'createdAt'],
      ...filtersAndSort,
    } as any);
  }

  async findOne(id: string) {
    const snapshot = await this.snapshotRepository.findOneBy({
      _id: validateObjectId(id),
    });
    if (!snapshot) {
      throw new HttpException(
        `Snapshot with id '${id}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return snapshot;
  }

  async remove(id: string) {
    const { affected } = await this.snapshotRepository.delete(
      validateObjectId(id),
    );
    if (!affected) {
      throw new HttpException(
        `Snapshot with id '${id}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

// NOTE: Most of the code below can be extracted to a shared lib or module

const prepareFiltersAndSort = (listProductsDto) => {
  const where = {};
  if (listProductsDto.createdAfter) {
    where['createdAt'] = { $gte: new Date(listProductsDto.createdAfter) };
  }
  if (listProductsDto.createdBefore) {
    where['createdAt'] = { $lte: new Date(listProductsDto.createdBefore) };
  }
  if (listProductsDto.url) {
    // TODO: handle wildcards if needed, or even just strip `www`
    where['url'] = { $eq: stripUrl(listProductsDto.url) };
  }
  const orderBy =
    !listProductsDto.orderBy || listProductsDto.orderBy === 'createdAt'
      ? '_id' // MongoDB's ObjectId are chronological
      : listProductsDto.orderBy;
  const orderDirection = listProductsDto.orderDirection || 'DESC';

  const query = {
    order: { [orderBy]: orderDirection },
  };
  if (Object.keys(where).length) {
    query['where'] = where;
  }
  return query;
};

const validateObjectId = (id: string) => {
  let _id: ObjectId;
  try {
    _id = new ObjectId(id);
  } catch (error) {
    throw new HttpException(`Invalid id '${id}'`, HttpStatus.BAD_REQUEST);
  }
  return _id;
};

// This function is mainly to prevent duplicate snapshots url identifiers for the same URL
const stripUrl = (url: string) => {
  return url.toLowerCase().replace(/\/+$/, '');
};

const pageCrawler = async (url: string) => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();

    // we need to intercept requests to get outgoing urls
    await page.setRequestInterception(true);
    const outgoingUrls: Record<string, string[]> = {};
    configureRequestInterception(page, outgoingUrls);

    await page.goto(url);
    const screenshot = await saveScreenshot(page);

    const data = await page.evaluate(evaluateJs);
    await page.setRequestInterception(true);

    return { screenshot, url, outgoingUrls, ...data };
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
};

const configureRequestInterception = (
  page: Page,
  outgoingUrls: Record<string, string[]>,
) => {
  page.on('request', (request) => {
    // NOTE: can filter same-domain requests (or just the first document call) here
    outgoingUrls[request.resourceType()] ||= [];
    outgoingUrls[request.resourceType()].push(request.url());
    request.continue();
  });
};

const saveScreenshot = async (page: any) => {
  const timestamp = new Date().getTime();
  await page.setViewport({ width: 1080, height: 1024 });
  const screenshot = '/tmp/screenshots/' + timestamp + '.png';
  const dirName = path.dirname(screenshot);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
  await page.screenshot({
    path: screenshot,
  });
  return screenshot;
};

// This function is executed in the browser context (i.e. can't use variables and functions from the node context)
const evaluateJs = () => {
  const mapElementsAttribute = (selector: string, attribute: string) => {
    const elements = document.querySelectorAll(selector);
    const attrs = Array.from(elements).map((element) =>
      element.getAttribute(attribute),
    );
    return [...new Set(attrs)];
  };

  const getMetatag = (name: string) => {
    const element =
      document.querySelector(`meta[name="${name}"]`) ||
      document.querySelector(`meta[property="og:${name}"]`) ||
      document.querySelector(`meta[property="twitter:${name}"]`);
    return element?.getAttribute('content');
  };

  const values = {
    documentTitle: document.title,
    links: mapElementsAttribute(`a`, 'href'), // NOTE: can filter same-domain (or other filtering) links here
    stylesheets: mapElementsAttribute("link[rel='stylesheet']", 'href'),
    scripts: mapElementsAttribute('script[src]', 'src'),
    metadata: {
      icon: mapElementsAttribute("link[rel='icon']", 'href'),
      title: getMetatag('title'),
      description: getMetatag('description'),
      image: getMetatag('image'),
      author: getMetatag('author'),
    },
  };

  return values;
};
