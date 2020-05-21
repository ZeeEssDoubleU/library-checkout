import axios from "axios";
import jwt_decode from "jwt-decode";
// import actions
import { logErrors } from "./errors";
import { setRequestHeaders } from "./common";
import { actionTypes_books } from "./books";
import { actionTypes_users, currentUser_setState } from "./users";

export const actionTypes_auth = {
	REGISTER_USER: "REGISTER_USER",
	SAVE_ACCESS_TOKEN: "SAVE_ACCESS_TOKEN",
};

export const registerUser = async (userData, history, state, dispatch) => {
	try {
		const response = await axios.post(
			"/api/auth/register",
			userData,
			setRequestHeaders(state),
		);
		// response should only be email (check registerUser controller)
		// if successful, redirect to login page
		history.push("/login");

		console.log(`Success!  Created new user:`, response.data.newUser);
	} catch (error) {
		logErrors({ register: error.response.data.message }, dispatch);
	}
};

// ! deprecated: local login
const local_login = {
	// export const loginUser_local = async (userData, history, state, dispatch) => {
	// 	try {
	// 		const response = await axios.post(
	// 			"/api/auth/login/local",
	// 			userData,
	// 			setRequestHeaders(state),
	// 		);
	// 		dispatch({
	// 			type: actionTypes_users.SET_CURRENT_USER,
	// 			payload: response.data,
	// 		});
	// 		// TODO reactivate redirect when ready
	// 		// // if successful, redirect to checked-out page
	// 		// history.push("/books/checked-out");
	// 		console.log(`Success!  Logged in as user:`, response.data.email);
	// 	} catch (error) {
	// 		logErrors({ login_local: error.response.data.message }, dispatch);
	// 	}
	// };
};

export const loginUser_jwt = async (userData, history, state, dispatch) => {
	try {
		const response = await axios.post(
			"/api/auth/login/jwt",
			userData,
			setRequestHeaders(state),
		);
		const { jwt_refresh, jwt_access } = response.data;

		accessToken_setState(jwt_access, history, state, dispatch);
		currentUser_setState(jwt_refresh, dispatch);

		// TODO consider redirecting
		// // if successful, redirect to checked-out page
		// history.push("/books/checked-out");
	} catch (error) {
		logErrors({ login_jwt: error.response.data.message }, dispatch);
	}
};

// check if user logged in upon loading or refreshing initial page
export const accessToken_get = async (history, state, dispatch) => {
	console.log("Getting access token...");

	// check if jwt_access exists in local storage
	const tokenInClient =
		state.jwt_access && state.jwt_access_expiry ? true : false; // boolean

	// if token in client, check if expired
	if (tokenInClient) {
		const now = Date.now(); // ms
		const expiration = state.jwt_access_expiry; // ms
		const expired = now >= expiration; // boolean

		// if token expired, get current user
		if (expired) {
			console.log("Access token expired.  Refreshing...");
			await accessToken_refresh(history, state, dispatch);
		}
		// TODO: consider redirecting
		// history.push("/books/checked-out");
	} else {
		console.log("No access token in client.  Refreshing...");
		accessToken_refresh(history, state, dispatch);
	}
};

// refresh access token
export const accessToken_refresh = async (history, state, dispatch) => {
	try {
		const response = await axios.get(
			"/api/auth/access-token/refresh",
			setRequestHeaders(state),
		);

		const { jwt_access, message } = response.data;

		accessToken_setState(jwt_access, history, state, dispatch);
		console.log(message);
	} catch (error) {
		console.error(error);
		logErrors({ accessToken_refresh: error.response.data.message }, dispatch);
		history.push("/login");
	}
};

export const accessToken_refresh_auto = (
	history,
	state,
	dispatch,
	expiration,
) => {
	const now = Date.now(); // ms
	const duration = expiration - now - 3000; // ms

	setTimeout(() => accessToken_refresh(history, state, dispatch), duration);
};

export const accessToken_setState = (token, history, state, dispatch) => {
	// decode token to get user data and set login_user state
	const decoded = jwt_decode(token);
	const expiration = decoded.exp * 1000; // s -> ms

	// store token and expiration in memory
	dispatch({
		type: actionTypes_auth.SAVE_ACCESS_TOKEN,
		payload: {
			jwt_access: token,
			jwt_access_expiry: expiration,
		},
	});

	accessToken_refresh_auto(history, state, dispatch, expiration);
};

// logout functions
export const logoutUser = (history, state, dispatch) => {
	console.log("Logging user out...");
	logoutFrontend(history, dispatch);
	logoutBackend(state, dispatch);
};

export const logoutFrontend = async (history, dispatch) => {
	// remove user_current from local storage
	localStorage.removeItem("persistedState");

	// remove token and expiration in memory
	await dispatch({
		type: actionTypes_auth.SAVE_ACCESS_TOKEN,
		payload: {
			jwt_access: null,
			jwt_access_expiry: null,
		},
	});
	// logout from front-end and remove checked out books
	await dispatch({
		type: actionTypes_users.SET_CURRENT_USER,
		payload: null,
	});
	await dispatch({
		type: actionTypes_books.GET_BOOKS_CHECKED_OUT,
		payload: null,
	});

	console.log("User logged out from client (front end).");
};

export const logoutBackend = async (state, dispatch) => {
	try {
		// logout from session
		const response = await axios.get(
			"/api/auth/logout",
			setRequestHeaders(state),
		);

		console.log(response.data.message);
	} catch (error) {
		logErrors({ logout_session: error.response.data.message }, dispatch);
	}
};
