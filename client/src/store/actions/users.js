import axios from "axios";
import jwt_decode from "jwt-decode";
// import actions
import { logErrors } from "./errors";
import { setRequestHeaders } from "./common";
import { actionTypes as actionTypes_books } from "./books";

export const actionTypes = {
	GET_USERS: "GET_USERS",
	GET_USER: "GET_USER",
	REGISTER_USER: "REGISTER_USER",
	SET_CURRENT_USER: "SET_CURRENT_USER",
};

// get all users
export const getUsers = async (dispatch) => {
	try {
		const response = await axios.get("/api/users", setRequestHeaders());
		dispatch({
			type: actionTypes.GET_USERS,
			payload: response.data,
		});
	} catch (error) {
		logErrors(error.response.data, dispatch);
	}
};

export const registerUser = async (userData, history, dispatch) => {
	try {
		const response = await axios.post(
			"/api/users/register",
			userData,
			setRequestHeaders(),
		);
		// response should only be email (check registerUser controller)
		console.log(`Success!  Created new user:`, response.data.newUser);
		// if successful, redirect to login page
		history.push("/login");
	} catch (error) {
		logErrors({ register: error.response.data }, dispatch);
	}
};

export const loginUser_local = async (userData, history, dispatch) => {
	try {
		const response = await axios.post(
			"/api/users/login-local",
			userData,
			setRequestHeaders(),
		);
		dispatch({
			type: actionTypes.SET_CURRENT_USER,
			payload: response.data,
		});
		console.log(`Success!  Logged in as user:`, response.data.email);
		// TODO reactivate redirect when ready
		// // if successful, redirect to checked-out page
		// history.push("/books/checked-out");
	} catch (error) {
		logErrors({ login_local: error.response.data }, dispatch);
	}
};

export const loginUser_jwt = async (userData, history, dispatch) => {
	try {
		const response = await axios.post(
			"/api/users/login-jwt",
			userData,
			setRequestHeaders(),
		);
		const { token } = response.data;
		// store JWT in local storage
		localStorage.setItem("JWT", token);

		// decode JWT to get user data and set login_user state
		const decoded = jwt_decode(token);
		dispatch({
			type: actionTypes.SET_CURRENT_USER,
			payload: decoded,
		});

		console.log(`Success!  Logged in as user:`, decoded.email);
		// TODO reactivate redirect when ready
		// // if successful, redirect to checked-out page
		// history.push("/books/checked-out");
	} catch (error) {
		logErrors({ login_jwt: error.response.data }, dispatch);
	}
};

export const logoutUser = (history, dispatch) => {
	// remove JWT from localStorage
	localStorage.removeItem("JWT");

	dispatch({
		type: actionTypes_books.GET_BOOKS_CHECKED_OUT,
		payload: null,
	});
	dispatch({
		type: actionTypes.SET_CURRENT_USER,
		payload: null,
	});
	// redirect to login page
	if (history.location.pathname !== "/login") {
		history.push("/login");
	}
};

// *************
// helpers
// *************

export const checkUserLoggedIn = (history, dispatch) => {
	// check if JWT exists in local storage
	const token = localStorage.JWT ? localStorage.JWT : null;

	if (token) {
		// decode JWT to get user data and set login_user state
		const decoded = jwt_decode(token);
		dispatch({
			type: actionTypes.SET_CURRENT_USER,
			payload: decoded,
		});

		// get currentTime in seconds
		const currentTime = Date.now() / 1000;
		// if JWT expired, logout user

		if (currentTime > decoded.exp) {
			logoutUser(history, dispatch);
		}
	}
};
