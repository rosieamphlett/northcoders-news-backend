const { Article, Comment } = require("../models");

const getAllArticles = (req, res, next) => {
  Article.find().populate('created_by')
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next)
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(article_id)) next({status: 400, msg: `${article_id} is not a valid mongo id`})
  Article.find({ _id: article_id }).populate('created_by')
    .then(article => {
      article.length !== 0
        ? res.status(200).send({ article })
        : next({ status: 404, msg: "Article not found" });
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(article_id)) next({status: 400, msg: `${article_id} is not a valid mongo id`})
  Comment.find({ belongs_to: article_id }).populate('created_by')
    .then(comment => {
      comment !== null
        ? res.status(200).send({ comment })
        : next({ status: 400, msg: "400: Article not found" });
    })
    .catch(next);
};

// why does populate never work

const postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Comment.create({
    body: req.body.body,
    belongs_to: article_id,
    created_by: req.body.created_by
  })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const votesArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { vote } = req.query;
  let num = 0;
  if (vote === "up") num = 1;
  if (vote === "down") num = -1;

  Article.findByIdAndUpdate(article_id, { $inc: { votes: num } }, { new: true })
    .then(article => {
      res.status(200).send({ article, msg: 'thanks for your vote!' });
    })
    .catch(next);
};

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  votesArticleById
};