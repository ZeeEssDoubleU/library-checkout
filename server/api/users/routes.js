import express from "express";
// import controllers
import { getUsers, getUser_byId, updateUser, deleteUser } from "./controllers";

const router = express.Router();

// @route - GET api/users
// @desc - get all users
// @access - public
router.get("/", getUsers);

// @route - GET api/users/:id
// @desc - get user by id
// @access - public
router.get("/:id", getUser_byId);

// @route - PUT api/users/:id
// @desc - update user by id
// @access - public
router.put("/:id", updateUser);

// @route - DELETE api/users/:id
// @desc - delete user by id
// @access - public
router.delete("/:id", deleteUser);

export default router;
