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
		const result = await db.query(`SELECT * FROM public.user WHERE id = $1`, [
			id,
		]);
		return res.status(200).json(result.rows);
	} catch (error) {
		return next({
			status: 404,
			message: `User not found.`,
			stack: error.stack,
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
