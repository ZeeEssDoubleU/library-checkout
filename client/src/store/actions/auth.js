import axios from "axios";
import jwt_decode from "jwt-decode";
// import actions
import { logErrors } from "./errors";
import { setRequestHeaders } from "./common";
import { actionTypes as actionTypes_books } from "./books";
import { actionTypes as actionTypes_users } from "./users";

export const actionTypes = {
	REGISTER_USER: "REGISTER_USER",
};

export const registerUser = async (userData, history, dispatch) => {
	try {
		const response = await axios.post(
			"/api/auth/register",
			userData,
			setRequestHeaders(),
		);
		// response should only be email (check registerUser controller)
		// if successful, redirect to login page
		history.push("/login");

		console.log(`Success!  Created new user:`, response.data.newUser);
	} catch (error) {
		logErrors({ register: error.response.data.message }, dispatch);
	}
};

export const loginUser_local = async (userData, history, dispatch) => {
	try {
		const response = await axios.post(
			"/api/auth/login/local",
			userData,
			setRequestHeaders(),
		);
		dispatch({
			type: actionTypes_users.SET_CURRENT_USER,
			payload: response.data,
		});

		// TODO reactivate redirect when ready
		// // if successful, redirect to checked-out page
		// history.push("/books/checked-out");

		console.log(`Success!  Logged in as user:`, response.data.email);
	} catch (error) {
		logErrors({ login_local: error.response.data.message }, dispatch);
	}
};

export const loginUser_jwt = async (userData, history, dispatch) => {
	try {
		const response = await axios.post(
			"/api/auth/login/jwt",
			userData,
			setRequestHeaders(),
		);
		const { token } = response.data;
		// store JWT in local storage
		localStorage.setItem("JWT", token);

		// decode JWT to get user data and set login_user state
		const decoded = jwt_decode(token);
		dispatch({
			type: actionTypes_users.SET_CURRENT_USER,
			payload: decoded,
		});

		// TODO reactivate redirect when ready
		// // if successful, redirect to checked-out page
		// history.push("/books/checked-out");

		console.log(`Success!  Logged in as user:`, decoded.email);
	} catch (error) {
		logErrors({ login_jwt: error.response.data.message }, dispatch);
	}
};

export const checkUserLoggedIn = (history, dispatch) => {
	// check if JWT exists in local storage
	const token = localStorage.JWT ? localStorage.JWT : null;

	if (token) {
		// decode JWT to get user data and set user_current state
		const decoded = jwt_decode(token);
		dispatch({
			type: actionTypes_users.SET_CURRENT_USER,
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

export const logoutUser = (history, dispatch) => {
	logoutFrontend(history, dispatch);
	logoutBackend(dispatch);
};

export const logoutFrontend = (history, dispatch) => {
	// remove JWT from localStorage
	localStorage.removeItem("JWT");

	// logout from front-end and remove checked out books
	dispatch({
		type: actionTypes_users.SET_CURRENT_USER,
		payload: null,
	});
	dispatch({
		type: actionTypes_books.GET_BOOKS_CHECKED_OUT,
		payload: null,
	});

	// redirect to login page
	if (history.location.pathname !== "/login") {
		history.push("/login");
	}

	console.log("User logged out from client (front end).");
};

export const logoutBackend = async (dispatch) => {
	try {
		// logout from session
		const response = await axios.get("/api/auth/logout", setRequestHeaders());

		console.log(response.data.message);
	} catch (error) {
		logErrors({ logout_session: error.response.data.message }, dispatch);
	}
};