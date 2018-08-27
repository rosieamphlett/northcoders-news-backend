const topicsRouter = require("express").Router();
const {
  getAllTopics,
  getArticlesByTopic,
  addArticleByTopic
} = require("../controllers/topics");

topicsRouter.route("/").get(getAllTopics);
topicsRouter
  .route("/:topic_slug/articles")
  .get(getArticlesByTopic)
  .post(addArticleByTopic);

module.exports = topicsRouter