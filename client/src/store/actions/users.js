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
		logErrors({ get_user: error.response.data.message }, dispatch);
	}
};

// TODO: may not need history as param
export const getUser_current = async (history, dispatch) => {
	try {
		const response = await axios.get(
			"/api/users/current",
			setRequestHeaders(),
		);
		const { jwt_access } = response.data;

		// store JWT in local storage
		localStorage.setItem("jwt_access", jwt_access);

		// decode JWT to get user data and set user_current state
		const decoded = jwt_decode(jwt_access);
		dispatch({
			type: actionTypes.SET_CURRENT_USER,
			payload: decoded,
		});
	} catch (error) {
		logErrors({ current_user: error.response.data.message }, dispatch);
	}
};

export const getUser_byId = async (dispatch) => {
	try {
		const response = await axios.get("/api/users/id/1", setRequestHeaders());
	} catch (error) {
		logErrors({ current_user: error.response.data.message }, dispatch);
	}
};

// *************
// helpers
// *************
