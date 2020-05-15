import express from "express";
// import controllers
import {
	registerUser,
	// loginUser_local, // ! deprecated: local login
	loginUser_jwt,
	loginUser_facebook_callback,
	logoutUser,
	generateToken_refresh,
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
router.post("/login/jwt", loginUser_jwt);

// router.post("/login/local", loginUser_local); // ! deprecated: local login

router.get("/login/facebook", passport.authenticate("facebook"));
router.get(
	"/login/facebook/callback",
	passport.authenticate("facebook", {
		session: false,
		failureRedirect: "http://localhost:3000/login",
	}),
	loginUser_facebook_callback,
);

// @route - GET api/auth/token/refresh
// @desc - refresh access token
// @access - public
router.get("/token/refresh", generateToken_refresh);

// @route - GET api/auth
// @desc - get all users
// @access - public
router.get("/logout", logoutUser);

export default router;
