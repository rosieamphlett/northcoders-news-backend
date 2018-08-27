const usersRouter = require("express").Router();
const { getUserByUsername, getAllUsers } = require("../controllers/users");

usersRouter.route("/:username").get(getUserByUsername);
usersRouter.get("/", getAllUsers);

module.exports = usersRouter