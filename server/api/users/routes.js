import express from "express";
// import controllers
import {
	getUsers,
	getUser_byId,
	registerUser,
	loginUser_local,
	loginUser_jwt,
	updateUser,
	deleteUser,
	logoutUser,
} from "./controllers";

const router = express.Router();

// @route - GET api/users
// @desc - get all users
// @access - public
router.get("/", getUsers);

// @route - GET api/users
// @desc - get all users
// @access - public
router.get("/logout", logoutUser);

// @route - GET api/users/:id
// @desc - get user by id
// @access - public
router.get("/:id", getUser_byId);

// @route - POST api/users/register
// @desc - register user
// @access - public
router.post("/register", registerUser);

// @route - POST api/users/login
// @desc - login user
// @access - public
router.post("/login-local", loginUser_local);
router.post("/login-jwt", loginUser_jwt);

// @route - PUT api/users/:id
// @desc - update user by id
// @access - public
router.put("/:id", updateUser);

// @route - DELETE api/users/:id
// @desc - delete user by id
// @access - public
router.delete("/:id", deleteUser);

export default router;
