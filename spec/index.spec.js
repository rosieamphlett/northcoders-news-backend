process.env.NODE_ENV = "test";
const { expect } = require("chai");
const app = require("../app");
const request = require("supertest")(app);
const seedDB = require("../seed/seed");
const testData = require("../seed/testData/index");
const mongoose = require("mongoose");


describe("before each test", () => {
  let comments, topics, users, articles
  beforeEach(() => {
      return seedDB(
          testData.topics,
          testData.users,
          testData.articles,
          testData.comments)
          .then(docs => {
              [topics, users, articles, comments] = docs;
            });
        });
        after(() => {
        return mongoose.disconnect();
    });
})
describe("nc news testing", () => {
    describe("topicz", () => {
        it("get returns status 200 and all da topics", () => {
            return request.get("/api/topics")
            .expect(200) 
            .then(res => {
                expect(res.body).to.be.an("object");
                expect(res.body.topics.length).to.equal(2);
                expect(res.body.topics[0]).to.have.all.keys('_id', 'title', 'slug', '__v')
                expect(res.body.topics[0].title).to.equal('Mitch')
                expect(res.body.topics[1].slug).to.equal("cats");
                });
            });
        })
    })
