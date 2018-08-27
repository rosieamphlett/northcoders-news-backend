const usersRouter = require("express").Router();
const { getUserByUsername, getAllUsers } = require("../controllers/users");

usersRouter.route("/:username").get(getUserByUsername);
userRouter.get("/", getAllUsers);

module.exports = usersRouter