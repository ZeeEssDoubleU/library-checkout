import express from "express";
// import controllers
import {
	getUsers,
	getUser_byId,
	getUser_current,
	updateUser,
	deleteUser,
} from "./controllers";

const router = express.Router();

// @route - GET api/users
// @desc - get all users
// @access - public
router.get("/", getUsers);

// @route - GET api/users/:id
// @desc - get user by id
// @access - public
router.get("/id/:id", getUser_byId);

// @route - GET api/users/current
// @desc - get current user
// @access - public
router.get("/current", getUser_current);

// @route - PUT api/users/:id
// @desc - update user by id
// @access - public
router.put("/id/:id", updateUser);

// @route - DELETE api/users/:id
// @desc - delete user by id
// @access - public
router.delete("/id/:id", deleteUser);

export default router;
