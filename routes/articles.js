const articlesRouter = require ('express').Router();
const { getAllArticles, getArticleByID, getAllCommentsFromArticle, addNewCommentToArticle, changeArticleVoteByOne} = require ('../controllers/articles')

articlesRouter.route('/')
    .get(getAllArticles);

articlesRouter.route("/:article_id")
    .get(getArticleByID)
    .put(changeArticleVoteByOne)

articlesRouter.route("/:article_id/comments")
    .get(getAllCommentsFromArticle)
    .post(addNewCommentToArticle)

module.exports = articlesRouter;