const config = {
    dev: {
      DB_URL: 'mongodb://localhost:27017/northcoders_news',
      dataPath:'./devData'
    },
    test: {
      DB_URL: 'mongodb://localhost:27017/northcoders_news_test',
      dataPath:'./testData'
    }
  }
  
const NODE_ENV = process.env.NODE_ENV || 'dev';
  
module.exports = config[NODE_ENV];