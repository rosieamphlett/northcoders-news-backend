const { Topic, Article } = require("../models");

const getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => { res.status(200).send({ topics }) })
    .catch(next);
};

const getArticlesByTopicSlug = (req, res, next) => {
  const { topic_slug } = req.params;
  Article.find({ belongs_to: topic_slug })
    .then(articles => {
      (articles.length === 0) ? next({ status: 404, msg: "404: topic not found, woops" }) : 
      res.status(200).send({ articles });
    })
  .catch(err => next(err));
};

const addArticleByTopicSlug = (req, res, next) => {
  const { topic_slug } = req.params;
  Article.create({
    ... req.body,
    belongs_to: topic_slug,
  })
    .then(article => {
      res.status(201).send({ msg: "you've successfully added an article!", article });
    })
    .catch(err => {
      if (err.name === 'ValidationError') err.status = 400;
      else if (err.status === 404) err.message = 'User not found :(';
      next(err);
  });
};

module.exports = {
  getAllTopics,
  getArticlesByTopicSlug,
  addArticleByTopicSlug
};