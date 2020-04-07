import axios from "axios";

export const types = {
	GET_BOOKS_ALL: "GET_BOOKS_ALL",
	GET_BOOKS_AVAILABLE: "GET_BOOKS_AVAILABLE",
	GET_BOOKS_CHECKED_OUT: "GET_BOOKS_CHECKED_OUT",
	GET_BOOK: "GET_BOOK",
};

export const getBooks = async (dispatch) => {
	try {
		const response = await axios({
			url: "api/books",
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
