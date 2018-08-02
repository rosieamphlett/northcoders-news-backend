const formatArticleData = (topicRef, userRef, articleData) => {
    return articleData.map(doc => {
        return {
            ...doc,
            belongs_to: topicRef[doc.topic],
            created_by: userRef[doc.created_by]
        };
    });
};
  
const formatCommentData = (articleRef, userRef, commentData) => {
    return commentData.map(doc => {
        return {
            ...doc,
            belongs_to: articleRef[doc.belongs_to],
            created_by: userRef[doc.created_by]
        };
    });
};
  
//creates ref object for article, comments and topic references
const createRefObject = (mongoIdDocs, objRefKey) => {
    return mongoIdDocs.reduce((refObj, index) => {
        refObj[index[objRefKey]] = index._id;
        return refObj;
    }, {});
};
  
module.exports = { createRefObject, formatArticleData, formatCommentData };