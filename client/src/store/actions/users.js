import axios from "axios";
import jwt_decode from "jwt-decode";
// import actions
import { logErrors } from "./errors";
import { setRequestHeaders } from "./common";
import { actionTypes_books } from "./books";
import { logoutUser, accessToken_refresh, accessToken_setState } from "./auth";

export const actionTypes_users = {
	GET_USERS: "GET_USERS",
	GET_USER: "GET_USER",
	REGISTER_USER: "REGISTER_USER",
	SET_CURRENT_USER: "SET_CURRENT_USER",
};

// get all users
export const getUsers = async (state, dispatch) => {
	try {
		const response = await axios.get("/api/users", setRequestHeaders(state));
		dispatch({
			type: actionTypes_users.GET_USERS,
			payload: response.data,
		});
	} catch (error) {
		logErrors({ get_users: error.response }, dispatch);
	}
};

export const getUser_current = async (history, state, dispatch) => {
	try {
		console.log("Checking if user is logged in...");

		const response = await axios.get(
			"/api/users/current",
			setRequestHeaders(state),
		);
		const { jwt_refresh, jwt_access } = response.data;

		await accessToken_setState(jwt_access, history, state, dispatch);
		currentUser_setState(jwt_refresh, dispatch);

		// TODO: consider redirecting
		// history.push("/books/checked-out");

		// if available, remove logout flag from local storage
		if (localStorage.logout) {
			localStorage.removeItem("logout");
		}
	} catch (error) {
		logErrors({ current_user: error.response.data.message }, dispatch);

		// logout user
		logoutUser(history, state, dispatch);
	}
};

export const currentUser_setState = (token, dispatch) => {
	// decode refresh token and set as current user
	const decoded = jwt_decode(token);

	dispatch({
		type: actionTypes_users.SET_CURRENT_USER,
		payload: decoded,
	});

	console.log(`Success!  Logged in as user:`, decoded.email);
};

export const getUser_byId = async (state, dispatch) => {
	try {
		const response = await axios.get(
			"/api/users/id/1",
			setRequestHeaders(state),
		);
	} catch (error) {
		logErrors({ current_user: error.response.data.message }, dispatch);
	}
};
