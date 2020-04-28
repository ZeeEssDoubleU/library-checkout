import axios from "axios";
import jwt_decode from "jwt-decode";
// import actions
import { logErrors } from "./errors";

export const types = {
	GET_USERS: "GET_USERS",
	GET_USER: "GET_USER",
	REGISTER_USER: "REGISTER_USER",
	SET_CURRENT_USER: "SET_CURRENT_USER",
};

// get all users
export const getUsers = async (dispatch) => {
	try {
		const response = await axios.get("/api/users");
		dispatch({
			type: types.GET_USERS,
			payload: response.data,
		});
	} catch (error) {
		logErrors(error.response.data, dispatch);
	}
};

export const registerUser = async (userData, history) => {
	try {
		const response = await axios.post("/api/users/register", userData);
		// response should only be email (check registerUser controller)
		console.log(`Success!  Created new user:`, response.data.newUser);
		// if successful, redirect to login page
		history.push("/login");
	} catch (error) {
		return error.response.data;
	}
};

export const loginUser_local = async (userData, history, dispatch) => {
	try {
		const response = await axios.post("/api/users/login-local", userData);
		dispatch({
			type: types.SET_CURRENT_USER,
			payload: response.data,
		});
		console.log(`Success!  Logged in as user:`, response.data.email);
		// // if successful, redirect to checked-out page
		// history.push("/books/checked-out");
	} catch (error) {
		return error.response.data;
	}
};

export const loginUser_jwt = async (userData, history, dispatch) => {
	try {
		const response = await axios.post("/api/users/login-jwt", userData);
		const { email, token } = response.data;
		// store JWT in local storage
		localStorage.setItem("JWT", token);
		// add JWT to ALL authorization headers
		setAuthToken(token);

		// decode JWT to get user data and set login_user state
		const decoded = jwt_decode(token);
		dispatch({
			type: types.SET_CURRENT_USER,
			payload: decoded,
		});

		console.log(`Success!  Logged in as user:`, decoded.email);
		// // if successful, redirect to checked-out page
		// history.push("/books/checked-out");
	} catch (error) {
		return error.response.data;
	}
};

// *************
// helpers
// *************
export const setAuthToken = (token) => {
	if (token) {
		// if token exists, apply to ALL requests
		axios.defaults.headers.common["Authorization"] = `JWT ${token}`;
	} else {
		// else, delete the authorization header
		delete axios.defaults.headers.common["Authorization"];
	}
};
