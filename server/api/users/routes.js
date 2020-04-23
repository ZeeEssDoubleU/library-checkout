const router = require(`express`).Router();
// import controllers
const {
	getUsers,
	getUser_byId,
	createUser,
	loginUser,
	updateUser,
	deleteUser,
	logoutUser,
} = require("./controllers");

// @route - GET api/users
// @desc - get all users
// @access - public
router.get(`/`, getUsers);

// @route - GET api/users/:id
// @desc - get user by id
// @access - public
router.get(`/:id`, getUser_byId);

// @route - POST api/users/register
// @desc - register user
// @access - public
router.post(`/register`, createUser);

// @route - POST api/users/login
// @desc - login user
// @access - public
router.post(`/login`, loginUser);

// @route - PUT api/users/:id
// @desc - update user by id
// @access - public
router.put(`/:id`, updateUser);

// @route - DELETE api/users/:id
// @desc - delete user by id
// @access - public
router.delete(`/:id`, deleteUser);

// @route - DELETE api/users/logout
// @desc - logout current logged in user
// @access - private
router.delete(`/logout`, logoutUser);

module.exports = router;
