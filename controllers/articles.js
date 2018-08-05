const { Article, Comment } = require("../models");

const getAllArticles = (req, res, next) => {
  Article.find()
    .then(articles => res.status(200).send({ articles }))
    .catch(err => next(err));
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Article.find({ _id: article_id })
    .then(article => {
      article ? res.status(200).send({article}) : 
      (err.status === 404) ? next({ status: 404, msg: 'article not found'}) : next ({ status: 400, msg: 'bad request'})
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id })
    .then(comment => {
      (comment.length) ? res.status(200).send({ comment }) : next ({status: 404, msg: 'article not found'})
    })
    .catch(err => err.name === "CastError" ? err.status = 400: next(err));
};

const postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Comment.create({
    body: req.body.body,
    belongs_to: article_id,
    created_by: req.body.created_by
  })
    .then(comment => {
      res.status(201).send({ msg: 'you have successfully posted a new comment!', comment});
    })
};

const upVoteDownVote = (req, res, next) => {
  if (req.query.vote === "up" || req.query.vote === "down") {
    const voteInc =
      req.query.vote === "up" ? 1 : req.query.vote === "down" ? -1 : -1;
    Article.update({ _id: req.params.article }, { $inc: { votes: voteInc } })
      .then(article => {
        res.status(200).send({ msg: "You have added a vote", article });
      })
      .catch(next);
  } else
    next({status: 400, msg: "Bad request"
  });
};

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  upVoteDownVote
};