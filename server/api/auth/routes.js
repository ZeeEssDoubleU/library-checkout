import express from "express";
// import controllers
import {
	registerUser,
	loginUser_local,
	loginUser_jwt,
	loginUser_oAuth2_facebook,
	logoutUser,
} from "./controllers";
// import passport
import passport from "../../config/passport";

const router = express.Router();

// @route - POST api/auth/register
// @desc - register user
// @access - public
router.post("/register", registerUser);

// @route - POST api/auth/login/type
// @desc - login user
// @access - public
router.post("/login/local", loginUser_local);
router.post("/login/jwt", loginUser_jwt);
router.get("/login/facebook", passport.authenticate("facebook"));
router.get(
	"/login/facebook/callback",
	passport.authenticate("facebook", {
		successRedirect: "http://localhost:3000/books/checked-out",
		failureRedirect: "http://localhost:3000/login",
	}),
);

// @route - GET api/auth
// @desc - get all users
// @access - public
router.get("/logout", logoutUser);

export default router;
