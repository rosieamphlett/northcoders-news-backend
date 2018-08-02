const commentsRouter = require ('express').Router();
const { changeCommentVoteByOne, deleteComment} = require ('../controllers/comments')

commentsRouter.route("/:comment_id")
    .put(changeCommentVoteByOne)
    .delete(deleteComment)

module.exports = commentsRouter;