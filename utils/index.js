const formatTopicData = topicData => {
    return topicData.map(topic => {
      return {
        ...topic
      };
    });
  };
  
  const formatUserData = userData => {
    return userData.map(user => {
      return {
        ...user
      };
    });
  };
  
  const formatArticleData = (articleData, userDocs) => {
    return articleData.map(article => {
      const created_by = userDocs.find(
        user => user.username === article.created_by
      )._id;
      return {
        ...article,
        belongs_to: article.topic,
        created_by
      };
    });
  };
  
  const formatCommentData = (commentData, userDocs, articleDocs) => {
    return commentData.map(comment => {
      const created_by = userDocs.find(
        user => user.username === comment.created_by
      )._id;
      const belongs_to = articleDocs.find(
        article => article.title === comment.belongs_to
      )._id;
      return {
        ...comment,
        belongs_to,
        created_by
      };
    });
  };
  
  module.exports = {
    formatArticleData,
    formatTopicData,
    formatUserData,
    formatCommentData
  };