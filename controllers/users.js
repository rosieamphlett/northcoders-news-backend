const { User } = require("../models");

const getAllUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .then(user => {
      user.length !== 0 ? res.status(200).send({ user }) : next({ status: 404, msg: "404: User not found" });
    })
    .catch(next)
};

module.exports = { getAllUsers, getUserByUsername };