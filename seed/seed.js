const mongoose = require("mongoose");
const { Article, Comment, Topic, User } = require("../models");
const { formatArticleData, formatCommentData, createRefObject } = require("../utils");


const seedDB = (topicData, userData, articleData, commentData) => {
  return mongoose.connection.dropDatabase()

  .then(() => {
    return Promise.all([
      Topic.insertMany(topicData),
      User.insertMany(userData)
    ]);
  })

  .then(([topicDocs, userDocs]) => {
    const topicRefs = createRefObject(topicDocs, "slug");
    const userRefs = createRefObject(userDocs, "username");
    return Promise.all([
      Article.insertMany(formatArticleData(topicRefs, userRefs, articleData)),
      topicDocs,
      userDocs,
      userRefs
    ]);
  })

  .then (([articleDocs, topicDocs, userDocs, userRefs]) => {
    const articleRefs = createRefObject(articleDocs, "title");
    return Promise.all([
      Comment.insertMany(
        formatCommentData(articleRefs, userRefs, commentData)),
        topicDocs,
        userDocs,
        articleDocs
    ]);
  })
};

module.exports = seedDB;
