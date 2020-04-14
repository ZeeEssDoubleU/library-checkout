const express = require(`express`);
const router = express.Router();
const { pool } = require(`../config`);
// import validations
const validateRegister = require(`../validate/register`);

const findUser = async (input_type, input) => {
	const result = await pool.query(
		`SELECT * FROM public.user WHERE ${input_type} = $1`,
		[input],
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

	const {
		first_name,
		last_name,
		email,
		password,
		password_confirm,
	} = request.body;

	try {
		// find user
		const user = await findUser("email", email);

		// if user already registered, send error
		if (user) {
			errors.email = `${user.email} is already registered.`;
			response.status(422).json(errors);
		} else {
			// create user
			const result = await pool.query(
				`INSERT INTO public.user (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
				[first_name, last_name, email, password],
			);

			// TODO: add password encryption

			response.status(201).json(result.rows[0]);
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
