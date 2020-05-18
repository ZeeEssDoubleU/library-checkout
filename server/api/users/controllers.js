import { db } from "../../config/database";
import bcrypt from "bcrypt";
import capitalize from "lodash/fp/capitalize";
import jwt from "jsonwebtoken";
// import validations
import validateRegister from "../../../client/src/validate/register";
import validateLogin from "../../../client/src/validate/login";
// import passport config
import passport from "../../config/passport";
// import controller
import { accessToken_refresh } from "../auth/controllers";

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

export const updateUser_refreshToken = async (refresh_token, email) => {
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

export const getUser_current = async (req, res, next) => {
	if (req.cookies && req.cookies.jwt_refresh) {
		// if access token does NOT exist
		if (!req.cookies.jwt_access) {
			console.log("No access cookie.  Generating new...");

			// accessToken_refresh will resolve to client on its own
			return accessToken_refresh(req, res, next);

			// if access token exists
		} else {
			const jwt_refresh = req.cookies.jwt_refresh;
			const jwt_access = req.cookies.jwt_access;

			// verify jwt_refresh (auto checks if expired)
			// need to try jwt_refresh first as security buffer for jwt_access
			try {
				await jwt.verify(jwt_refresh, process.env.JWT_REFRESH_SECRET);
				console.log("jwt_refresh verified.");
			} catch (error) {
				return next({
					status: 401,
					message: { jwt_refresh: error.message },
					stack: new Error(),
				});
			}

			// verify jwt_access (auto checks if expired)
			try {
				await jwt.verify(jwt_access, process.env.JWT_ACCESS_SECRET);
				console.log("jwt_access verified.");
			} catch (error) {
				next({
					status: 401,
					message: { jwt_access: error.message },
					stack: new Error(),
				});
				// accessToken_refresh will resolve to client on its own
				return accessToken_refresh(req, res, next);
			}

			// SUCCESS: if jwt cookies found, return cookies and log user into client
			return res.status(200).json({
				jwt_refresh: req.cookies.jwt_refresh,
				jwt_access: req.cookies.jwt_access,
				message: `JWT cookies found and user logged into client.`,
			});
		}

		// else, return error
	} else {
		return next({
			status: 401,
			message: { jwt_refresh: "Refresh cookie NOT found.  Logging out..." },
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
