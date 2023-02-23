import { Injectable } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Please use POST method to crawl a page, or CRUD `/sites` to interact with existing records.';
  }

  async crawl(url: string) {
    return await pageCrawler(url);
  }
}

const pageCrawler = async (url: string) => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();

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
