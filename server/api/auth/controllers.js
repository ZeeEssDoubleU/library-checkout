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
import { findUser } from "../users/controllers";

// *************
// helpers
// *************
export const checkAuthenticated = (req, res, next) => {
	console.log("SESSION:", req.session);

	// if user authenticated (from local strat), move on
	if (req.isAuthenticated() === true) {
		return next();
	} else {
		// else, check if JWT available and valid
		passport.authenticate("jwt", { session: false }, (err, user, info) => {
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
		})(req, res, next);
	}
};

export const checkLoggedIn = (req, res, next) => {
	return req.isAuthenticated()
		? res.json(`WHAT!!! Already logged in!!!`)
		: next();
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
		// find user
		const user = await this.findUser({ email });

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

				// create new user in database
				const result = await db.query(
					`INSERT INTO public.user (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
					[
						capitalize(newUser.first_name),
						capitalize(newUser.last_name),
						newUser.email,
						newUser.password,
					],
				);

				// return and respond with registered user
				const registeredUser = result.rows[0];
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

export const loginUser_local = async (req, res, next) => {
	const { errors, isValid } = validateLogin(req.body);

	// if request not valid, return errors
	if (!isValid) {
		return next({
			status: 422,
			message: errors,
			stack: new Error(`Check login validator.`),
		});
	}

	passport.authenticate("local", (err, user, info) => {
		if (err) return next(err);

		// if no user
		if (!user) {
			// email error returned
			if (info.type === `email`) {
				errors.email = info.message;
				return next({
					status: 401,
					message: errors,
					stack: new Error(errors.email),
				});
			}
			// password error returned
			if (info.type === `password`) {
				errors.password = info.message;
				return next({
					status: 401,
					message: errors,
					stack: new Error(errors.password),
				});
			}
		}

		// if user, login user
		req.login(user, (err) => {
			if (err) return next(err);

			console.log(`Success!  Password is correct :D`);
			return res.status(200).json(user);
		});
	})(req, res, next);
};

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
		// find user (use this because of exports)
		const user = await this.findUser({ email });

		// if no email (user) found, send error
		if (!user) {
			errors.email = `Email (user) not found.`;
			return next({
				status: 401,
				message: errors,
				stack: new Error(errors.email),
			});
		} else {
			// compare passwords
			const match = await bcrypt.compare(password, user.password);
			if (match) {
				console.log(`Success!  Password is correct :D`);

				const payload = {
					id: user.id,
					email: user.email,
					firstName: user.first_name,
					lastName: user.last_name,
				};

				// create jwt
				jwt.sign(
					payload,
					process.env.JWT_SECRET,
					{ expiresIn: "10m" },
					(err, token) => {
						if (err) return next(err);

						// return token along with extra data
						return res.status(200).json({
							token,
							message: `User found and logged in (token created).`,
						});
					},
				);
			} else {
				errors.password = `Password is incorrect :(`;
				return res.status(401).json(errors);
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

export const loginUser_oAuth2_facebook = (req, res, next) => {
	console.log("facebook auth");
};

export const logoutUser = (req, res) => {
	req.logout();
	return res.status(200).json({ message: `User logged out.` });
};
