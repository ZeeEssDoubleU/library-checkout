import axios from "axios";
// import actions
import { logErrors } from "./errors";
import { setRequestHeaders } from "./common";

export const actionTypes_books = {
	GET_BOOKS_ALL: "GET_BOOKS_ALL",
	GET_BOOKS_AVAILABLE: "GET_BOOKS_AVAILABLE",
	GET_BOOKS_CHECKED_OUT: "GET_BOOKS_CHECKED_OUT",
	GET_BOOK: "GET_BOOK",
};

// get all books
export const getBooks = async (state, dispatch) => {
	try {
		const response = await axios.get("/api/books", setRequestHeaders(state));
		dispatch({
			type: actionTypes_books.GET_BOOKS_ALL,
			payload: response.data,
		});
	} catch (error) {
		logErrors(error.response.data.message, dispatch);
	}
};

// get available books
export const getBooks_available = async (state, dispatch) => {
	try {
		const response = await axios.get(
			"/api/books/available",
			setRequestHeaders(state),
		);
		dispatch({
			type: actionTypes_books.GET_BOOKS_AVAILABLE,
			payload: response.data,
		});
	} catch (error) {
		logErrors(error.response.data.message, dispatch);
	}
};

// get checked out books
export const getBooks_checkedOut = async (state, dispatch) => {
	try {
		const response = await axios.get(
			"/api/books/checked-out",
			setRequestHeaders(state),
		);
		dispatch({
			type: actionTypes_books.GET_BOOKS_CHECKED_OUT,
			payload: response.data,
		});
	} catch (error) {
		logErrors(error.response.data.message, dispatch);
	}
};
