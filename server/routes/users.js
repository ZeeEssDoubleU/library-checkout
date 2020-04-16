const express = require(`express`);
const router = express.Router();
const { pool } = require(`../config`);
const bcrypt = require("bcrypt");
const capitalize = require("lodash/fp/capitalize");
// import validations
const validateRegister = require(`../../client/src/validate/register`);
const validateLogin = require(`../../client/src/validate/login`);

const findUser = async (input) => {
	const key = Object.keys(input)[0];

	const result = await pool.query(
		`SELECT * FROM public.user WHERE ${key} = $1`,
		[input[key]],
	);
	return result.rows[0];
};

// @route - GET api/users
// @desc - get all users
// @access - public
router.get(`/`, async (request, response) => {
	try {
		const result = await pool.query(
			`SELECT * FROM public.user ORDER BY last_name ASC`,
		);
		response.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
	}
});

// @route - GET api/users/:id
// @desc - get user by id
// @access - public
router.get(`/:id`, async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const result = await pool.query(
			`SELECT * FROM public.user WHERE id = $1`,
			[id],
		);
		response.status(200).json(result.rows);
	} catch (error) {
		throw error;
	}
});

// @route - POST api/users/register
// @desc - register user
// @access - public
router.post(`/register`, async (request, response) => {
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
			response.status(422).json(errors);
		} else {
			// create new user object (so password can be hashed)
			const newUser = { first_name, last_name, email, password };

			// hash (encrypt password)
			bcrypt.hash(newUser.password, 12, async (err, hash) => {
				if (err) throw err;
				// hash password
				newUser.password = await hash;

				// create new user in database
				const result = await pool.query(
					`INSERT INTO public.user (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
					[
						capitalize(newUser.first_name),
						capitalize(newUser.last_name),
						newUser.email,
						newUser.password,
					],
				);

				response.status(201).json(result.rows[0]);
			});
		}
	} catch (error) {
		console.error(error);
	}
});

// @route - POST api/users/login
// @desc - login user
// @access - public
router.post(`/login`, async (request, response) => {
	// validate request
	const { errors, isValid } = validateLogin(request.body);

	// if request not valid, return errors
	if (!isValid) {
		return response.status(422).json(errors);
	}

	try {
		const { email, password } = request.body;
		// find user
		const user = await findUser({ email });

		// if no email (user) found, send error
		if (!user) {
			errors.email = `Email (user) not found.`;
			response.status(404).json(errors);
		} else {
			// compare passwords
			const match = await bcrypt.compare(password, user.password);
			if (match) {
				console.log("MATCH MATCH MATCH");
			} else {
				errors.password = `Password is incorrect.`;
				response.status(401).json(errors);
			}

			// TODO: FINISH REST OF LOGIN FUNCTION USING JWT FOR SESSION COOKIES
			// TODO: MAYBE ADD LOGGED IN USER TO STORE STATE
			// // hash (encrypt password)
			// bcrypt.hash(newUser.password, 12, async (err, hash) => {
			// 	if (err) throw err;
			// 	// hash password
			// 	newUser.password = await hash;

			// 	// create new user in database
			// 	const result = await pool.query(
			// 		`INSERT INTO public.user (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
			// 		[
			// 			newUser.first_name,
			// 			newUser.last_name,
			// 			newUser.email,
			// 			newUser.password,
			// 		],
			// 	);

			// 	response.status(201).json(result.rows[0]);
			// });
		}
	} catch (error) {
		console.error(error);
	}
});

// @route - POST api/users
// @desc - create new user
// @access - public
router.post(`/`, async (request, response) => {
	const { name, email } = request.body;

	try {
		const result = await pool.query(
			`INSERT INTO public.user (name, email) VALUES ($1, $2) RETURNING *`,
			[name, email],
		);
		response.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error);
	}
});

// @route - PUT api/users/:id
// @desc - update user by id
// @access - public
router.put(`/:id`, async (request, response) => {
	const id = parseInt(request.params.id);
	const { name, email } = request.body;

	try {
		const result = await pool.query(
			`UPDATE public.user SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
			[name, email, id],
		);
		response.status(200).json(result.rows[0]);
	} catch (error) {
		console.error(error);
	}
});

// @route - DELETE api/users/:id
// @desc - delete user by id
// @access - public
router.delete(`/:id`, async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const result = await pool.query(
			`DELETE FROM public.user WHERE id = $1 RETURNING *`,
			[id],
		);
		response.status(200).send(`Deleted user with ID: ${id}`);
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;
