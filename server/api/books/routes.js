import express from "express";
// import controllers
import {
	getBooks,
	getBooks_available,
	getBooks_checkedOut,
	getBook_byId,
	postBook,
	updateBook,
	deleteBook,
} from "./controllers";
import { checkAuthenticated } from "../auth/controllers";

const router = express.Router();

// @route - GET api/books
// @desc - get all books
// @access - public
router.get("/", getBooks);

// @route - GET api/books/available
// @desc - get all available books
// @access - public
router.get("/available", getBooks_available);

// @route - GET api/books/checked-out
// @desc - get all checked out books
// @access - private
router.get("/checked-out", checkAuthenticated, getBooks_checkedOut);
// router.get("/checked-out", getBooks_checkedOut);

// @route - GET api/books/:id
// @desc - get book by id
// @access - public
router.get("/:id", getBook_byId);

// @route - POST api/books
// @desc - create new book
// @access - public
router.post("/", postBook);

// @route - PUT api/books/:id
// @desc - update book by id
// @access - public
router.put("/:id", updateBook);

// @route - DELETE api/books/:id
// @desc - delete book by id
// @access - private
router.delete("/:id", deleteBook);

export default router;
