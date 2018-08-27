const { Comment } = require("../models");

const getAllComments = (req, res, next) => {
  Comment.find()
    .then(comments => {
      comments.length !== 0 ?
      res.status(200).send({ comments })
      : next({ status: 400, msg: "No comments yet!" });
    })
    .catch(next);
};

const putCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { vote } = req.query;
  let num = 0;
  if (vote === "up") num = 1;
  if (vote === "down") num = -1;

  Comment.findByIdAndUpdate(comment_id, { $inc: { votes: num } }, { new: true })
    .then(comment => {
      res.status(200).send({ comment, msg: 'thanks for your vote!' });
    })
    .catch(next);
};

const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id)
    .then(comment => {
      res.status(200).send({ comment, msg: "your comment has been deleted!" });
    })
    .catch(next);
};


module.exports = {
  getAllComments,
  putCommentById,
  deleteCommentById
};