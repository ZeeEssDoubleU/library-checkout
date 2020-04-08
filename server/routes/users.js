const express = require("express");
const router = express.Router();
const { pool } = require("../config");
const { validationResult } = require("express-validator");

const users = `SELECT * FROM public.user`;

// @route - GET /users
// @desc - get all users
// @access - public
router.get("/", async (request, response) => {
	try {
		const result = await pool.query(`${users} ORDER BY last_name ASC`);
		response.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
	}
});

// @route - GET /users/:id
// @desc - get user by id
// @access - public
router.get("/:id", async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const result = await pool.query("SELECT * FROM user WHERE id = $1", [id]);
		response.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
	}
});

// @route - POST /users
// @desc - create new user
// @access - public
router.post("/", async (request, response) => {
	const { name, email } = request.body;

	try {
		const result = await pool.query(
			`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
			[name, email],
		);
		response.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error);
	}
});

// @route - PUT /users/:id
// @desc - update user by id
// @access - public
router.put("/:id", async (request, response) => {
	const id = parseInt(request.params.id);
	const { name, email } = request.body;

	try {
		const result = await pool.query(
			`UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
			[name, email, id],
		);
		response.status(200).json(result.rows[0]);
	} catch (error) {
		console.error(error);
	}
});

// @route - DELETE /users/:id
// @desc - delete user by id
// @access - public
router.delete("/:id", async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const result = await pool.query(
			"DELETE FROM user WHERE id = $1 RETURNING *",
			[id],
		);
		response.status(200).send(`Deleted user with ID: ${id}`);
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;
