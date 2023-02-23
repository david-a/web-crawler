export default () => ({
  port: 3000,
  db: {
    type: 'mongodb',
    url: 'mongodb://db',
    database: 'crawl_db',
  },
});
