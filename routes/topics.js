const topicsRouter = require ('express').Router();
const { getAllTopics, getArticlesByTopic, addArticleToTopic } = require ('../controllers/topics')

topicsRouter.route('/')
    .get(getAllTopics);

topicsRouter.route("/:topic/articles")
    .get(getArticlesByTopic)
    .post(addArticleToTopic);

module.exports = topicsRouter;