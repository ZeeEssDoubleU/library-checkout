import { db } from "../../config/database";
import bcrypt from "bcrypt";
import capitalize from "lodash/fp/capitalize";
import jwt from "jsonwebtoken";
// import validations
import validateRegister from "../../../client/src/validate/register";
import validateLogin from "../../../client/src/validate/login";
// import passport config
import passport from "../../config/passport";

// *************
// helpers
// *************
export const findUser = async (input) => {
	const key = Object.keys(input)[0];

	const result = await db.query(
		`SELECT * FROM public.user WHERE ${key} = $1`,
		[input[key]],
	);
	return result.rows[0];
};

export const checkAuthenticated = (request, response, next) => {
	// if user authenticated (from local strat), move on
	if (request.isAuthenticated() === true) {
		return next();
	} else {
		// else, check if JWT available and valid
		passport.authenticate("jwt", { session: false }, (err, user, info) => {
			if (err) return next(err);

			// if jwt invalid (didn't return user), return error
			if (!user) {
				if (info.type === `jwt`) {
					return next({
						status: 401,
						message: { jwt: info.message },
						stack: new Error(info.message),
					});
				}
			}

			// if jwt valid, move on
			return next();
		})(request, response, next);
	}
};

export const checkLoggedIn = (request, response, next) => {
	return request.isAuthenticated()
		? response.json(`WHAT!!! Already logged in!!!`)
		: next();
};

// *************
// controllers
// *************
export const getUsers = async (request, response, next) => {
	try {
		const result = await db.query(
			`SELECT * FROM public.user ORDER BY last_name ASC`,
		);
		return response.status(200).json(result.rows);
	} catch (error) {
		return next({
			status: 404,
			message: `Could not find users.`,
			stack: error.stack,
		});
	}
};

export const getUser_byId = async (request, response, next) => {
	const id = parseInt(request.params.id);

	try {
		const result = await db.query(`SELECT * FROM public.user WHERE id = $1`, [
			id,
		]);
		return response.status(200).json(result.rows);
	} catch (error) {
		return next({
			status: 404,
			message: `User not found.`,
			stack: error.stack,
		});
	}
};

export const registerUser = async (request, response, next) => {
	// validate request
	const { errors, isValid } = validateRegister(request.body);

	// if request not valid, return errors
	if (!isValid) {
		return next({
			status: 422,
			message: errors,
			stack: new Error(`Check register validator.`),
		});
	}

	try {
		const { first_name, last_name, email, password } = request.body;
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
				return response.status(201).json({
					success: "Created new user",
					user: registeredUser.email,
				});
			});
		}
	} catch (error) {
		return next(error);
	}
};

export const loginUser_local = async (request, response, next) => {
	// TODO: will likely refactor validation to use YUP or JOI so that they can be implemented as middleware
	// TODO: using validation as middleware will allow me to use passport.validate better as middleware
	const { errors, isValid } = validateLogin(request.body);

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
		request.login(user, (err) => {
			if (err) return next(err);

			console.log(`Success!  Password is correct :D`);
			return response.status(200).json(user);
		});
	})(request, response, next);
};

export const loginUser_jwt = async (request, response, next) => {
	// validate request
	const { errors, isValid } = validateLogin(request.body);

	// if request not valid, return errors
	if (!isValid) {
		return next({
			status: 422,
			message: errors,
			stack: new Error(`Check login validator`),
		});
	}

	try {
		const { email, password } = request.body;
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
						return response.status(200).json({
							token,
							message: `User found and logged in (token created).`,
						});
					},
				);
			} else {
				errors.password = `Password is incorrect :(`;
				return response.status(401).json(errors);
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

export const updateUser = async (request, response, next) => {
	const id = parseInt(request.params.id);
	const { name, email } = request.body;

	try {
		const result = await db.query(
			`UPDATE public.user SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
			[name, email, id],
		);
		return response.status(200).json(result.rows[0]);
	} catch (error) {
		return next(error);
	}
};

export const deleteUser = async (request, response, next) => {
	const id = parseInt(request.params.id);

	try {
		const result = await db.query(
			`DELETE FROM public.user WHERE id = $1 RETURNING *`,
			[id],
		);
		return response
			.status(200)
			.json({ message: `Deleted user with ID: ${id}` });
	} catch (error) {
		return next(error);
	}
};

export const logoutUser = (request, response) => {
	request.logout();
	return response.status(200).json({ message: `User logged out.` });
};
