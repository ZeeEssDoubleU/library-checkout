import { db } from "../../config/database";
import bcrypt from "bcrypt";
import capitalize from "lodash/fp/capitalize";
import jwt from "jsonwebtoken";
// import validations
import validateRegister from "../../../client/src/validate/register";
import validateLogin from "../../../client/src/validate/login";
// import passport config
import passport from "../../config/passport";
// import helpers
import {
	createUser,
	findUser,
	updateUser_refreshToken,
} from "../users/controllers";

// *************
// helpers
// *************
export const checkAuthenticated = (req, res, next) => {
	// if user authenticated (from local strat), move on
	// ! deprecated: local login (keeping isAuthenticated in place anyways)
	if (req.isAuthenticated() === true) {
		return next();
	} else {
		// else, check if jwt_access available and valid
		passport.authenticate(
			"jwt_access",
			{ session: false },
			(err, user, info) => {
				if (err) return next(err);

				// if jwt valid, move on
				if (user) {
					return next();
				}

				// if jwt invalid (didn't return user), return error
				if (!user) {
					return next({
						status: 401,
						message: { jwt: info.message },
						stack: new Error(info.message),
					});
				}
			},
		)(req, res, next);
	}
};

// TODO: figure out where to use this
export const checkLoggedIn = (req, res, next) => {
	return req.isAuthenticated()
		? res.json(`WHAT!!! Already logged in!!!`)
		: next();
};

// TODO: FIX TOKEN ISSUES !!!!! RES, COOKIES, ETC.
export const refreshToken_generate = async (req, res, next, user) => {
	try {
		// create jwt
		const token = await jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
			expiresIn: "30d", // 30 days
		});

		// add refresh_token to user in database
		// used for verification when refreshing new jwt_access tokens
		updateUser_refreshToken(token, user.email);

		res.cookie("jwt_refresh", token, { httpOnly: true, secure: false });
		console.log("Refresh token created.");
		return token;
	} catch (error) {
		return next(error);
	}
};

export const accessToken_generate = async (req, res, next, user) => {
	try {
		// create jwt
		const token = await jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
			expiresIn: "10m", // 10 minutes
		});

		res.cookie("jwt_access", token, { httpOnly: true, secure: false });
		console.log("Access token created.");
		return token;
	} catch (error) {
		return next(error);
	}
};

// TODO: need to complete access refresh flow
export const accessToken_refresh = async (req, res, next) => {
	// else, check if jwt_refresh available and valid
	passport.authenticate(
		"jwt_refresh",
		{ session: false },
		(err, user, info) => {
			if (err) return next(err);

			// if jwt valid, move on
			if (user) {
				return next();
			}

			// if jwt invalid (didn't return user), return error
			if (!user) {
				return next({
					status: 401,
					message: { jwt: info.message },
					stack: new Error(info.message),
				});
			}
		},
	)(req, res, next);

	const refreshToken_existing = await findUser();
};

// *************
// controllers
// *************
export const registerUser = async (req, res, next) => {
	// validate request
	const { errors, isValid } = validateRegister(req.body);

	// if request not valid, return errors
	if (!isValid) {
		return next({
			status: 422,
			message: errors,
			stack: new Error(`Check register validator.`),
		});
	}

	try {
		const { first_name, last_name, email, password } = req.body;
		// check if user already exists
		const user = await findUser({ email });

		// if user already registered, send error
		if (user) {
			errors.email = `Email is already registered.`;
			return next({
				status: 422,
				message: errors,
				stack: new Error(errors.email),
			});
		} else {
			// create new user object (so password can be hashed)
			const newUser = { first_name, last_name, email, password };

			// hash (encrypt password)
			bcrypt.hash(newUser.password, 12, async (err, hash) => {
				if (err) return next(err);

				// hash password
				newUser.password = await hash;

				// create new user in database and return as registered
				const registeredUser = await createUser(newUser);

				// remove registered users password from response
				delete registeredUser.password;
				// return registered user to client
				return res.status(201).json({
					success: "Created new user",
					user: registeredUser.email,
				});
			});
		}
	} catch (error) {
		return next(error);
	}
};

// ! deprecated: local login
// export const loginUser_local = async (req, res, next) => {
// 	const { errors, isValid } = validateLogin(req.body);

// 	// if request not valid, return errors
// 	if (!isValid) {
// 		return next({
// 			status: 422,
// 			message: errors,
// 			stack: new Error(`Check login validator.`),
// 		});
// 	}

// 	passport.authenticate("local", (err, user, info) => {
// 		if (err) return next(err);

// 		// if no user
// 		if (!user) {
// 			// email error returned
// 			if (info.type === `email`) {
// 				errors.email = info.message;
// 				return next({
// 					status: 401,
// 					message: errors,
// 					stack: new Error(errors.email),
// 				});
// 			}
// 			// password error returned
// 			if (info.type === `password`) {
// 				errors.password = info.message;
// 				return next({
// 					status: 401,
// 					message: errors,
// 					stack: new Error(errors.password),
// 				});
// 			}
// 		}

// 		// add auth type to user before logging in
// 		user.auth = "local";

// 		// if user, login user
// 		req.login(user, (err) => {
// 			if (err) return next(err);

// 			console.log(`Success!  Password is correct :D`);
// 			return res.status(200).json(user);
// 		});
// 	})(req, res, next);
// };

export const loginUser_jwt = async (req, res, next) => {
	// validate request
	const { errors, isValid } = validateLogin(req.body);

	// if request not valid, return errors
	if (!isValid) {
		return next({
			status: 422,
			message: errors,
			stack: new Error(`Check login validator`),
		});
	}

	try {
		const { email, password } = req.body;
		// find user
		const user = await findUser({ email });

		// if no email (user) found, send error
		if (!user) {
			errors.email = `Email (user) not found.`;
			return next({
				status: 401,
				message: errors,
				stack: new Error(errors.email),
			});
		} else {
			// if user does NOT have password in database
			if (!user.password) {
				// TODO: need more elegant solution for this
				// have prompt to ask user if they would like to create password
				// have user enter password and password confirmation
				errors.password =
					"User does not have password.  Account created through a social network login button above (Facebook, Google, etc).  Please login with social network button.";
				return next({
					status: 401,
					message: errors,
					stack: new Error(errors.password),
				});
			}

			// compare passwords
			const match = await bcrypt.compare(password, user.password);
			if (match) {
				console.log(`Success!  Password is correct :D`);

				// add auth type and delete sensitive data before logging in
				user.auth = "jwt";
				await delete user.password;
				await delete user.refresh_token;

				// generate tokens
				await refreshToken_generate(req, res, next, user);
				const token = await accessToken_generate(req, res, next, user);

				return res.status(200).json({
					token,
					message: `User found and logged in (token created).`,
				});
			} else {
				errors.password = `Password is incorrect :(`;
				return next({
					status: 401,
					message: errors,
					stack: new Error(errors.password),
				});
			}
		}
	} catch (error) {
		return next(error);
	}
};

export const loginUser_facebook_callback = async (req, res, next) => {
	// profile fields returned from passport facebook strategy
	// password has been removed in deserialize
	const user = req.user;

	// add auth type and delete sensitive data before logging in
	user.auth = "facebook";
	await delete user.password;
	await delete user.refresh_token;

	// generate tokens
	await refreshToken_generate(req, res, next, user);
	await accessToken_generate(req, res, next, user);

	res.redirect("http://localhost:3000/oauth/callback");
};

// TODO: new login steps
// 1 -	generate accessToken
// 2 - 	generate refresh_token
// 3 - 	set refresh_token as http only cookie
// 4 - 	return accessToken and accessToken_expiry in json payload
// 5 -	store accessToken in memory
// 6 -	start countdown for silent refresh based on accessToken_expiry
// 7 -	hit /access-token/refresh endpoint to issue new accessToken and accessToken_expiry
// 8 - 	repeat from step 4 as long as necessary

// TODO: fix logout to remove AND invalidate access and refresh tokens
export const logoutUser = (req, res, next) => {
	if (req.cookies) {
		if (req.cookies.jwt_access) {
			res.clearCookie("jwt_access");
			console.log("jwt_access cleared from cookies.");
		}
		if (req.cookies.jwt_refresh) {
			res.clearCookie("jwt_refresh");
			console.log("jwt_refresh cleared from cookies.");
		}
	}

	if (req.user) {
		// needed if user logged into session (jwts are used in this instance, not sessions)
		req.logout();
		return res
			.status(200)
			.json({ message: `User logged out from session (back end).` });
	}

	return res
		.status(200)
		.json({ message: `No user logged into session (back end).` });
};
