import { db } from "../../config/database";

// query strings
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

// controllers
export const getBooks = async (request, response) => {
	try {
		const result = await db.query(`${books} ORDER BY book.title ASC`);
		return response.status(200).json(result.rows);
	} catch (error) {
		return console.error(error);
	}
};

export const getBooks_available = async (request, response) => {
	try {
		const result = await db.query(
			`${books} WHERE book.quantity_available > 0 ORDER BY book.title ASC`,
		);
		return response.status(200).json(result.rows);
	} catch (error) {
		return console.error(error);
	}
};

export const getBooks_checkedOut = async (request, response) => {
	try {
		const result = await db.query(
			`${books_checked_out} ORDER BY book.title ASC`,
		);
		return response.status(200).json(result.rows);
	} catch (error) {
		return console.error(error);
	}
};

export const getBook_byId = async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const result = await db.query(`${books} WHERE book.id = $1`, [id]);
		return response.status(200).json(result.rows);
	} catch (error) {
		return console.error(error);
	}
};

export const postBook = async (request, response) => {
	const { title, author } = request.body;

	try {
		const result = await db.query(
			`INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *`,
			[title, author],
		);
		return response.status(201).json(result.rows[0]);
	} catch (error) {
		return console.error(error);
	}
};

export const updateBook = async (request, response) => {
	const id = parseInt(request.params.id);
	const { title, author } = request.body;

	try {
		const result = await db.query(
			`UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *`,
			[title, author, id],
		);
		return response.status(200).json(result.rows[0]);
	} catch (error) {
		return console.error(error);
	}
};

export const deleteBook = async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const result = await db.query(
			"DELETE FROM book WHERE id = $1 RETURNING *",
			[id],
		);
		return response.status(200).send(`Deleted book with ID: ${id}`);
	} catch (error) {
		return console.error(error);
	}
};
