process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

const config = {
  test: {
    DB_URL: 'mongodb://localhost:27017/nc_news'
  },
  dev: {
    DB_URL: 'mongodb://localhost:27017/nc_news_test'
  },
  production: {
    DB_URL: 'mongodb://rosieamphlett:dolfairy09@ds211592.mlab.com:11592/the-best-nc-news'
  }
}

module.exports = config[process.env.NODE_ENV];
