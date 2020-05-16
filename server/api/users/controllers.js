import { db } from "../../config/database";
import bcrypt from "bcrypt";
import capitalize from "lodash/fp/capitalize";
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

export const createUser = async (input) => {
	const { first_name, last_name, email, password = null } = input;

	const result = await db.query(
		`INSERT INTO public.user (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
		[capitalize(first_name), capitalize(last_name), email, password],
	);
	return result.rows[0];
};

export const updateUser_refreshToken = async (input) => {
	const { refresh_token, email } = input;

	const result = await db.query(
		`UPDATE public.user SET refresh_token = $1 where email = $2 RETURNING *`,
		[refresh_token, email],
	);
	return result.rows[0];
};

// *************
// controllers
// *************
export const getUsers = async (req, res, next) => {
	try {
		const result = await db.query(
			`SELECT * FROM public.user ORDER BY last_name ASC`,
		);
		return res.status(200).json(result.rows);
	} catch (error) {
		return next({
			status: 404,
			message: `Could not find users.`,
			stack: error.stack,
		});
	}
};

export const getUser_byId = async (req, res, next) => {
	const id = parseInt(req.params.id);

	try {
		// findUser helper above
		const result = await findUser({ id });
		return res.status(200).json(result);
	} catch (error) {
		return next({
			status: 404,
			message: `User not found.`,
			stack: error.stack,
		});
	}
};

export const getUser_current = (req, res, next) => {
	// if jwt cookie found, return cookie and log user into client
	if (req.cookies && req.cookies.jwt_access) {
		return res.status(200).json({
			jwt_access: req.cookies.jwt_access,
			message: `jwt_access cookie found and user logged into client.`,
		});
		// else, return error
	} else {
		return next({
			status: 401,
			message: `JWT cookie NOT found.`,
			stack: new Error(),
		});
	}
};

export const updateUser = async (req, res, next) => {
	const id = parseInt(req.params.id);
	const { name, email } = req.body;

	try {
		const result = await db.query(
			`UPDATE public.user SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
			[name, email, id],
		);
		return res.status(200).json(result.rows[0]);
	} catch (error) {
		return next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	const id = parseInt(req.params.id);

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
