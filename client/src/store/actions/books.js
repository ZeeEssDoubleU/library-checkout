import axios from "axios";

export const types = {
	GET_BOOKS_ALL: "GET_BOOKS_ALL",
	GET_BOOKS_AVAILABLE: "GET_BOOKS_AVAILABLE",
	GET_BOOKS_CHECKED_OUT: "GET_BOOKS_CHECKED_OUT",
	GET_BOOK: "GET_BOOK",
};

// get all books
export const getBooks = async (dispatch) => {
	try {
		const response = await axios({
			method: "get",
			url: "/api/books",
			baseURL: "/",
		});
		dispatch({
			type: types.GET_BOOKS_ALL,
			payload: response.data,
		});
	} catch (error) {
		console.error(error);
	}
};

// get available books
export const getAvailableBooks = async (dispatch) => {
	try {
		const response = await axios({
			method: "get",
			url: "/api/books/available",
			baseURL: "/",
		});
		dispatch({
			type: types.GET_BOOKS_AVAILABLE,
			payload: response.data,
		});
	} catch (error) {
		console.error(error);
	}
};

// get checked out books
export const getCheckedOutBooks = async (dispatch) => {
	try {
		const response = await axios({
			method: "get",
			url: "/api/books/checked-out",
			baseURL: "/",
		});
		dispatch({
			type: types.GET_BOOKS_CHECKED_OUT,
			payload: response.data,
		});
	} catch (error) {
		console.error(error);
	}
};
