import axios from "axios";
// import actions
import { logErrors } from "./errors";
import { setRequestHeaders, saveAccessTokenToClient } from "./common";
import { actionTypes_books } from "./books";
import { actionTypes_users, getUser_current, setCurrentUser } from "./users";

export const actionTypes_auth = {
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

// ! deprecated: local login
// export const loginUser_local = async (userData, history, dispatch) => {
// 	try {
// 		const response = await axios.post(
// 			"/api/auth/login/local",
// 			userData,
// 			setRequestHeaders(),
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

export const loginUser_jwt = async (userData, history, dispatch) => {
	try {
		const response = await axios.post(
			"/api/auth/login/jwt",
			userData,
			setRequestHeaders(),
		);
		const { jwt_refresh, jwt_access } = response.data;

		saveAccessTokenToClient(jwt_access, history, dispatch);
		setCurrentUser(jwt_refresh, dispatch);

		// TODO reactivate redirect when ready
		// // if successful, redirect to checked-out page
		// history.push("/books/checked-out");
	} catch (error) {
		logErrors({ login_jwt: error.response.data.message }, dispatch);
	}
};

// refresh access token
export const accessToken_refresh = async (history, dispatch) => {
	try {
		const response = await axios.get(
			"/api/auth/access-token/refresh",
			setRequestHeaders(),
		);

		const { jwt_access, message } = response.data;

		saveAccessTokenToClient(jwt_access, history, dispatch);
		console.log(message);
	} catch (error) {
		logErrors({ accessToken_refresh: error.response.data.message }, dispatch);
		history.push("/login");
	}
};

// logout functions
export const logoutUser = (history, dispatch) => {
	console.log("Logging user out...");
	logoutFrontend(history, dispatch);
	logoutBackend(dispatch);
};

export const logoutFrontend = (history, dispatch) => {
	// remove JWT from localStorage
	localStorage.removeItem("jwt_access");
	console.log("jwt_access cleared from local storage.");

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

	// to support logging out from all windows
	window.localStorage.setItem("logout", Date.now());
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
