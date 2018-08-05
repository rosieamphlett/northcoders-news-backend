process.env.NODE_ENV = "test";
const app = require("../app");
const seedDb = require("../seed/seed");
const data = require("../seed/testData");
const { expect } = require("chai");
const request = require("supertest")(app);
const mongoose = require("mongoose");

describe("/api", () => {
  let articleDocs, commentDocs, topicDocs, userDocs, invalidId = mongoose.Types.ObjectId;

  beforeEach(() => {
    return seedDb(data).then(docs => {
      [articleDocs, commentDocs, topicDocs, userDocs] = docs;
    });
  });

  after(() => {
    return mongoose.disconnect();
  });

  describe("TOPICS", () => {
    it("GET /topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body.topics.length).to.equal(2);
          expect(res.body.topics[1].title).to.equal("Cats");
          expect(res.body.topics[0].slug).to.equal("mitch");
        });
    });

    it("GET /topics/:topic_slug/articles", () => {
      return request
        .get(`/api/topics/cats/articles`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("articles");
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[1].created_by).to.equal(userDocs[1]._id.toString());
        });
    });

    it("Returns error status of 400 with invalid mongo Id", () => {
      const test = "dfsdfjdf";
      return request
        .get(`/api/topics/${test}/articles`)
        .expect(404)
     });

     it("POST article returns status 201 and created article", () => {
      const newPost = {
        title: 'testing new article',
        body: 'much article such words many knowledge',
        created_by: userDocs[0]._id
      }
      return request
        .post(`/api/topics/${topicDocs[0]._id}/articles`)
        .send(newPost)
        .expect(201)
        .then(res => {
          expect(res.body).to.have.all.keys("article", "msg");
          expect(res.body.article.body).to.equal('much article such words many knowledge');
          expect(res.body.article.title).to.equal('testing new article');
        })
    });
    it("Test posting an article in an incorrect format", () => {
      return request
        .post(`/api/topics/${topicDocs[0]._id}/articles`)
        .send({ anything: "bad formatting" })
        .expect(400)
    });
  })

  describe('ARTICLES', () => {
    it("GET /articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body).to.have.keys("articles");
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[0]).to.have.keys("votes", "_id", "title", "body", "created_at", "created_by", "belongs_to", "__v");
        })
    });

    it("Can get a single article", () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("article");
          expect(res.body.article.length).to.equal(1);
          expect(res.body.article[0].body).to.equal("I find this existence challenging");
        });
    });
  
    it("Can get all the comments from one article", () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.length).to.equal(2);
          expect(res.body.comment[0]).to.have.all.keys("votes", "_id", "body", "belongs_to", "created_by", "created_at", "__v");
        });
    });

    it("GET /api/articles/:article_id invalid id", () => {
      const article_id = invalidId;
      return request
      .get(`/api/articles/${article_id}`)
      .expect(404);
    });

    it ("POST /api/articles/:article_id/comments", () => {
      const article_id = articleDocs[3]._id;
      const newComment = {
        body: "halloooo",
        belongs_to: article_id.toString(),
        created_by: userDocs[1]._id.toString()
      };
      return request
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(201)
        .then(res => {
          expect(res.body).to.have.all.keys("comment", "msg");
          expect(res.body.comment.body).to.equal('halloooo');
          expect(res.body.comment.belongs_to).to.equal(newComment.belongs_to);
          expect(res.body.comment.created_by).to.equal(newComment.created_by);
          return request.get(`/api/articles/${article_id}/comments`);
        })
        .then(res => {
          expect(res.body.comment.length).to.equal(3);
        });
    });

    it ("POST /api/articles/:article_id/comments invalid article_id", () => {
      const article_id = invalidId;
      const newComment = {
        body: "i hate testing",
        belongs_to: article_id.toString(),
        created_by: userDocs[1]._id.toString()
      };
      return request
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(404)
    })
  });
  
  describe("USERS", () => {
      it("GET /api/users/:username", () => {
        const username = userDocs[1].username.toString();
        return request
          .get(`/api/users/${username}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.all.keys("user");
          });
      });
      it("GET /api/users/:username invalid username", () => {
        const username = "invalid";
        return request.get(`/api/users/${username}`).expect(404);
      });
      it("GET /api/users/:username invalid username", () => {
        const username = "invalid";
        return request.get(`/api/users/${username}`).expect(404);
      });
      it("GET /api/users/:username invalid username", () => {
        const username = "invalid";
        return request.get(`/api/users/${username}`).expect(404);
      });
      it("GET /api/users/:username invalid username", () => {
        const username = "invalid";
        return request.get(`/api/users/${username}`).expect(404);
      });
      it("GET /api/users/:username invalid username", () => {
        const username = "invalid";
        return request.get(`/api/users/${username}`).expect(404);
      });
  });

  describe("COMMENTS", () => {
    it.only("PUT /api/comments/:comment_id changes vote up", () => {
      const comment_id = commentDocs[0]._id;
      return request
        .put(`/api/comments/${comment_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.all.keys("comment");
          expect(res.body.comment.votes).to.equal(8);
      });
    });
    it("PUT /api/comments/:comment_id invalid comment_id", () => {
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
    it("DELETE /api/comments/:comment_id invalid comment_id", () => {
      const comment_id = invalidId;
      return request.delete(`/api/comments/${comment_id}`).expect(404);
    });
});


});
