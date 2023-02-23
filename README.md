# NestJS app with Web Crawling and Asset Harvesting

## Description

This is a NestJS app, handling webpage crawling for requested url using Puppeteer, and managing those crawled websites using a mongoDB based REST API.

## Setup Instructions

1. Have Docker running on your system.
1. Start up the environment with you favorite js package manager (e.g. `pnpm start`, `yarn start` or `npm run start`)

## Usage

1. Take a website data snapshot by POSTING the api endpoint `/crawl` / `/snapshots` with a body like { "url": "https://google.com" }.
2. Fetch snapshots list (optionally with filters/sorting), show or delete a specific snapshot with the `/snapshots` REST api endpoint.

## API Reference / Documentation

You can find API reference in the following places:

1. Go to `https://david-a.github.io/web-crawler/` (Static, manually updated docs website)
2. Using the `/docs` endpoint when the app is running.
3. Import `docs/swagger.json` into your Swagger.

## Known Issues

1. .env file included for simplicity but usually it should be gitignored
2. TypeORM was used for connecting and querying MongoDB. Its MongoDB driver’s a bit outdated (^3.6.0, current version is 5.0.1) Another supported option is mongoose (mongoose implementation example can be shown here - https://github.com/david-a/vending-machine).
