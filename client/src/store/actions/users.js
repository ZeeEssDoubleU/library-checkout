import axios from "axios";
import jwt_decode from "jwt-decode";
// import actions
import { logErrors } from "./errors";
import { setRequestHeaders, saveAccessTokenToClient } from "./common";
import { actionTypes_books } from "./books";
import { logoutUser, accessToken_refresh } from "./auth";

export const actionTypes_users = {
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
			type: actionTypes_users.GET_USERS,
			payload: response.data,
		});
	} catch (error) {
		logErrors({ get_users: error.response.data.message }, dispatch);
	}
};

// check if user logged in upon loading or refreshing initial page
export const checkUserLoggedIn = (user_current, history, dispatch) => {
	console.log("Checking if user already logged in...");

	// if user logged into client
	if (user_current) {
		// check if jwt_access exists in local storage
		const tokenInClient =
			localStorage.jwt_access && localStorage.jwt_access_expiry
				? true
				: false;

		// if token in client, check if expired
		if (tokenInClient) {
			const now = Date.now(); // ms
			const expiration = localStorage.jwt_access_expiry; // ms
			const expired = now >= expiration; // boolean

			// if token expired, get current user
			if (expired) {
				console.log("Access token expired.  Refreshing...");
				accessToken_refresh(history, dispatch);
			}
		} else {
			console.log("No access token in client.  Refreshing...");
			accessToken_refresh(history, dispatch);
		}

		// if no user logged into client, get current user
	} else {
		getUser_current(history, dispatch);
	}
};

export const getUser_current = async (history, dispatch) => {
	try {
		const response = await axios.get(
			"/api/users/current",
			setRequestHeaders(),
		);
		const { jwt_refresh, jwt_access } = response.data;

		await saveAccessTokenToClient(jwt_access, history, dispatch);
		setCurrentUser(jwt_refresh, dispatch);

		// TODO: maybe keep this redirect
		// history.push("/books/checked-out");
	} catch (error) {
		logErrors({ current_user: error.response.data.message }, dispatch);

		// logout user and redirect to login
		logoutUser(history, dispatch);
		history.push("/login");
	}
};

export const setCurrentUser = (token, dispatch) => {
	// decode refresh token and set as current user
	const decoded = jwt_decode(token);

	dispatch({
		type: actionTypes_users.SET_CURRENT_USER,
		payload: decoded,
	});

	console.log(`Success!  Logged in as user:`, decoded.email);
};

export const getUser_byId = async (dispatch) => {
	try {
		const response = await axios.get("/api/users/id/1", setRequestHeaders());
	} catch (error) {
		logErrors({ current_user: error.response.data.message }, dispatch);
	}
};
