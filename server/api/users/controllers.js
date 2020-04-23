const { db } = require(`../../config/database`);
const bcrypt = require("bcrypt");
const capitalize = require("lodash/fp/capitalize");
// import validations
const validateRegister = require(`../../../client/src/validate/register`);
const validateLogin = require(`../../../client/src/validate/login`);
// import passport
const passport = require("../../config/passport");

// *************
// helpers
// *************
exports.findUser = async (input) => {
	const key = Object.keys(input)[0];

	const result = await db.query(
		`SELECT * FROM public.user WHERE ${key} = $1`,
		[input[key]],
	);
	return result.rows[0];
};

// TODO: reviset these middleware for passport local strategy if necessary
// *** NOT a fan of local strategy with react
exports.checkAuthenticated = (request, response, next) => {
	return request.isAuthenticated()
		? next()
		: response.status(401).json({ auth: `User is not authorized.` });
};

exports.checkLoggedIn = (request, response, next) => {
	return request.isAuthenticated()
		? response.json(`WHAT!!! Already logged in!!!`)
		: next();
};

// *************
// controllers
// *************
exports.getUsers = async (request, response, next) => {
	try {
		const result = await db.query(
			`SELECT * FROM public.user ORDER BY last_name ASC`,
		);
		return response.status(200).json(result.rows);
	} catch (error) {
		return console.error(error);
		return response.status(404);
	}
};

exports.getUser_byId = async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const result = await db.query(`SELECT * FROM public.user WHERE id = $1`, [
			id,
		]);
		return response.status(200).json(result.rows);
	} catch (error) {
		return console.error(error);
		return response.status(404).json(`User not found.`);
	}
};

exports.createUser = async (request, response) => {
	// validate request
	const { errors, isValid } = validateRegister(request.body);

	// if request not valid, return errors
	if (!isValid) {
		return response.status(422).json(errors);
	}

	try {
		const { first_name, last_name, email, password } = request.body;
		// find user
		const user = await findUser({ email });

		// if user already registered, send error
		if (user) {
			errors.email = `Email is already registered.`;
			return response.status(422).json(errors);
		} else {
			// create new user object (so password can be hashed)
			const newUser = { first_name, last_name, email, password };

			// hash (encrypt password)
			bcrypt.hash(newUser.password, 12, async (err, hash) => {
				if (err) throw err;
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
				// return response.status(201).json(registeredUser);

				return response.redirect(201, `/login`);
			});
		}
	} catch (error) {
		return console.error(error);
	}
};

//
//
//
//
//
//

exports.loginUser = async (request, response, next) => {
	const { errors, isValid } = validateLogin(request.body);

	// if request not valid, return errors
	if (!isValid) {
		return response.status(422).json(errors);
	}

	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return next(err);
		}
		// if no user
		if (!user) {
			// email error returned
			if (info.type === `email`) {
				errors.email = info.message;
				return response.status(404).json(errors);
			}
			// password error returned
			if (info.type === `password`) {
				errors.password = info.message;
				return response.status(401).json(errors);
			}
		}
		// if user, login user
		request.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
			return response.status(200).json(user.email);
		});
	})(request);
};

//
//
//
//
//
//

exports.updateUser = async (request, response) => {
	const id = parseInt(request.params.id);
	const { name, email } = request.body;

	try {
		const result = await db.query(
			`UPDATE public.user SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
			[name, email, id],
		);
		return response.status(200).json(result.rows[0]);
	} catch (error) {
		return console.error(error);
	}
};

exports.deleteUser = async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const result = await db.query(
			`DELETE FROM public.user WHERE id = $1 RETURNING *`,
			[id],
		);
		return response.status(200).send(`Deleted user with ID: ${id}`);
	} catch (error) {
		return console.error(error);
	}
};

exports.logoutUser = (request, response) => {
	request.logout();
	return response.redirect(`/login`);
};
