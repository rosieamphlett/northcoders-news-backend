process.env.NODE_ENV = "test";
const app = require("../app");
const seedDb = require("../seed/seed");
const data = require("../seed/testData");
const { expect } = require("chai");
const request = require("supertest")(app);
const mongoose = require("mongoose");

describe("/api", () => {
  let articleDocs,
    commentDocs,
    topicDocs,
    userDocs,
    invalidId = mongoose.Types.ObjectId;
  beforeEach(() => {
    return seedDb(data).then(docs => {
      [articleDocs, commentDocs, topicDocs, userDocs] = docs;
    });
  });
  after(() => {
    return mongoose.disconnect();
  });

  describe("TOPICS", () => {
    it("GET /api/topics- Get all topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body).to.have.keys("topics");
          expect(res.body.topics.length).to.equal(2);
          expect(res.body.topics[1].slug).to.equal("cats");
        });
    });

    it("GET /api/topics/:topic_slug/articles - get all articles on a certain topic", () => {
      return request
        .get("/api/topics/cats/articles")
        .expect(200)
        .then(res => {
          expect(res.body).to.have.keys("articles");
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[1].created_by).to.equal(
            userDocs[1]._id.toString());
        });
    });

    it("GET /api/topics/:topic_slug/articles invalid topic - returns a 400", () => {
      return request.get("/api/topics/bananas/articles").expect(400);
    });

    it("POST /api/topics/:topic_slug/articles", () => {
      const newArticle = {
        title: "Test new article on cats",
        created_by: userDocs[1]._id.toString(),
        body: "Body of test new article on cats"
      };
      return request
        .post("/api/topics/cats/articles")
        .send(newArticle)
        .expect(201)
        .then(res => {
          expect(res.body).to.have.keys("article", "msg");
          expect(res.body.article.title).to.equal(newArticle.title);
          expect(res.body.article.created_by).to.equal(newArticle.created_by);
          expect(res.body.article.body).to.equal(newArticle.body);
          return request.get("/api/topics/cats/articles");
        })
        .then(res => {
          expect(res.body.articles.length).to.equal(3);
        });
    });
  });

  describe("ARTICLES", () => {
    it("GET /api/articles- Get all articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body).to.have.keys("articles");
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[3].created_by).to.equal(
            userDocs[1]._id.toString()
          );
        });
    });

    it("GET /api/articles/:article_id- get a specific article via id", () => {
      const article_id = articleDocs[0]._id;
      return request
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("article");
          expect(res.body.article[0].body).to.equal(
            "I find this existence challenging"
          );
        });
    });

    it("GET /api/articles/:article_id invalid id", () => {
      const article_id = invalidId;
      return request.get(`/api/articles/${article_id}`).expect(404);
    });
    
    it("GET /api/articles/:article_id/comments", () => {
      const article_id = articleDocs[3]._id;
      return request
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("comment");
          expect(res.body.comment[1].body).to.equal(
            "I am 100% sure that we're not completely sure."
          );
        });
    });

    it("POST /api/articles/:article_id/comments", () => {
      const article_id = articleDocs[3]._id;
      const newComment = {
        body: "woohoo new comment",
        belongs_to: article_id.toString(),
        created_by: userDocs[1]._id.toString()
      };
      return request
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(201)
        .then(res => {
          expect(res.body).to.have.keys("comment");
          expect(res.body.comment.body).to.equal(newComment.body);
          expect(res.body.comment.belongs_to).to.equal(newComment.belongs_to);
          expect(res.body.comment.created_by).to.equal(newComment.created_by);
          return request.get(`/api/articles/${article_id}/comments`);
        })
        .then(res => {
          expect(res.body.comment.length).to.equal(3);
        });
    });

    it("POST /api/articles/:article_id/comments invalid article_id", () => {
      const article_id = invalidId;
      const newComment = {
        body: "woohoo second new commenttt",
        belongs_to: article_id.toString(),
        created_by: userDocs[1]._id.toString()
      };
      return request
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(404);
    });

    it("PUT /api/articles/:article_id -- vote up", () => {
      const article_id = articleDocs[3]._id;
      return request
        .put(`/api/articles/${article_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("article", "msg");
          expect(res.body.article.votes).to.equal(1);
        });
    });

    it("PUT /api/articles/:article_id -- vote down", () => {
      const article_id = articleDocs[3]._id;
      return request
        .put(`/api/articles/${article_id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("article", "msg");
          expect(res.body.article.votes).to.equal(-1);
        });
    });

    it("PUT /api/articles/:article_id ", () => {
      const article_id = invalidId;
      return request.put(`/api/articles/${article_id}?vote=down`).expect(404);
    });
  });

  describe("COMMENTS", () => {
    it("PUT /api/comments/:comment_id -- vote up", () => {
      const comment_id = commentDocs[0]._id;
      return request
        .put(`/api/comments/${comment_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("comment", "msg");
          expect(res.body.comment.votes).to.equal(8);
        });
    });

    it("PUT /api/comments/:comment_id -- vote down", () => {
      const comment_id = commentDocs[1]._id;
      return request
        .put(`/api/comments/${comment_id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.keys("comment", "msg");
          expect(res.body.comment.votes).to.equal(18);
        });
    });

    it("PUT /api/comments/:comment_id checking for invalid comment id", () => {
      const comment_id = invalidId;
      return request.put(`/api/comments/${comment_id}?vote=down`).expect(404);
    });

    it("DELETE /api/comments/:comment_id", () => {
      const comment_id = commentDocs[1]._id;
      return request
        .delete(`/api/comments/${comment_id}`)
        .expect(200)
        .then(() => {
          return request.get("/api/comments");
        })
        .then(res => {
          expect(res.body.comments.length).to.equal(7);
        });
    });

    it("DELETE /api/comments/:comment_id checking for invalid comment id", () => {
      const comment_id = invalidId;
      return request.delete(`/api/comments/${comment_id}`).expect(404);
    });
  });

  describe("USERS", () => {

    it("GET /api/users/:username", () => {
      const username = userDocs[1].username.toString();
      return request
        .get(`/api/users/${username}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.keys("user");
          expect(res.body.user.length).to.equal(1);
          expect(res.body.user[0].username).to.equal(username);
        });
    });

    it("GET /api/users/:username checking for invalid username", () => {
      const username = "invalidusername";
      return request.get(`/api/users/${username}`).expect(404);
    });
  });

});