const mongoose = require("mongoose");
const { Topic, Article } = require("../models");

const getAllTopics = (req, res, next) => {
    return Topic.find().then(topics => {
        res.status(200).send({ topics });
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
    Article.find({ belongs_to: req.params.topic }).populate("belongs_to", "slug -_id")
    .then(articles => {
        articles.length === 0
        ? next({
            status: 404,
            error_message: "Article cannot be found, it may have been moved or deleted"
        })
        : res.status(200).send({ articles });
    })
    .catch(next);
};


const addArticleToTopic = (req, res, next) => {
    const newArticle = new Article(req.body);
    newArticle.belongs_to = req.params.topic;
    Article.create(newArticle)
    .then(() => {
        res.status(201).send({ msg: "You've added a new article!", newArticle });
    })
    .catch(next);
};

module.exports = { getAllTopics, getArticlesByTopic, addArticleToTopic }
