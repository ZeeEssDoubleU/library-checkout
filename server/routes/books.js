const express = require("express");
const router = express.Router();
const { pool } = require("../config");
const { validationResult } = require("express-validator");

const books = `
	SELECT 
		book.id, book.title, 
		author.name AS author 
	FROM book 
	JOIN author ON author.id = book.author_id`;
const books_checked_out = `
	SELECT 
		book.id, book.title, 
		author.name AS author, 
		public.user.first_name AS user_first_name, public.user.last_name AS user_last_name, 
		checkouts.date_checkout, checkouts.date_overdue 
	FROM book
	JOIN author ON author.id = book.author_id
	JOIN checkouts ON checkouts.book_id = book.id
	JOIN public.user ON checkouts.user_id = public.user.id`;

// @route - GET api/books
// @desc - get all books
// @access - public
router.get("/", async (request, response) => {
	try {
		const result = await pool.query(`${books} ORDER BY book.title ASC`);
		response.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
	}
});

// @route - GET api/books/available
// @desc - get all available books
// @access - public
router.get("/available", async (request, response) => {
	try {
		const result = await pool.query(
			`${books} WHERE book.quantity_available > 0 ORDER BY book.title ASC`,
		);
		response.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
	}
});

// @route - GET api/books/checked-out
// @desc - get all checked out books
// @access - public
router.get("/checked-out", async (request, response) => {
	try {
		const result = await pool.query(
			`${books_checked_out} ORDER BY book.title ASC`,
		);
		response.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
	}
});

// @route - GET api/books/:id
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

// @route - POST api/books
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

// @route - PUT api/books/:id
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

// @route - DELETE api/books/:id
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
