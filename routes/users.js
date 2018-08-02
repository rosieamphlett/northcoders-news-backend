const usersRouter = require ('express').Router();
const { getUserProfileData } = require ('../controllers/users')

usersRouter.route('/:username')
    .get(getUserProfileData)

module.exports = usersRouter;