const express = require("express");
const router = express.Router();
const { pool } = require("../config");
const { validationResult } = require("express-validator");

const books = `SELECT book.id, book.title, author.name AS author FROM book JOIN author ON author.id = book.author_id`;

// @route - GET /books
// @desc - get all books
// @access - public
router.get("/", async (request, response) => {
	try {
		const result = await pool.query(`${books} ORDER BY id ASC`);
		response.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
	}
});

// @route - GET /books/:id
// @desc - get book by id
// @access - public
router.get("/:id", async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const result = await pool.query(`${books} WHERE book.id = $1`, [id]);
		response.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
	}
});

// @route - POST /books
// @desc - create new book
// @access - public
router.post("/", async (request, response) => {
	const { title, author } = request.body;

	try {
		const result = await pool.query(
			`INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *`,
			[title, author],
		);
		response.status(201).json(result.rows[0]);
	} catch (error) {
		console.error(error);
	}
});

// @route - PUT /books/:id
// @desc - update book by id
// @access - public
router.put("/:id", async (request, response) => {
	const id = parseInt(request.params.id);
	const { title, author } = request.body;

	try {
		const result = await pool.query(
			`UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *`,
			[title, author, id],
		);
		response.status(200).json(result.rows[0]);
	} catch (error) {
		console.error(error);
	}
});

// @route - DELETE /books/:id
// @desc - delete book by id
// @access - public
router.delete("/:id", async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const result = await pool.query(
			"DELETE FROM book WHERE id = $1 RETURNING *",
			[id],
		);
		response.status(200).send(`Deleted book with ID: ${id}`);
	} catch (error) {
		console.error(error);
	}
});

module.exports = router;
