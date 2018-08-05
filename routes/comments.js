const commentsRouter = require("express").Router();
const { commentVoteUpVoteDown, deleteCommentById } = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .put(commentVoteUpVoteDown)
  .delete(deleteCommentById);

module.exports = commentsRouter;