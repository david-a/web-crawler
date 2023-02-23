export default () => ({
  port: process.env.APP_PORT || 3000,
  db: {
    type: process.env.DB_TYPE || 'mongodb',
    url: process.env.DB_URI || 'mongodb://db/crawl_db',
    database: process.env.DB_NAME || 'crawl_db',
  },
});
