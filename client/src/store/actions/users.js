import axios from "axios";
// import actions
import { logErrors } from "./errors";

export const types = {
	GET_USERS: "GET_USERS",
	GET_USER: "GET_USER",
	REGISTER_USER: "REGISTER_USER",
	LOGIN_USER: "LOGIN_USER",
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
		history.push("/login");
	} catch (error) {
		return error.response.data;
	}
};

export const loginUser = async (userData, history, dispatch) => {
	try {
		const response = await axios.post("/api/users/login", userData);
		dispatch({
			type: types.LOGIN_USER,
			payload: response.data,
		});
		console.log(`Success!  Logged in as user: ${response.data}.`);
	} catch (error) {
		return error.response.data;
	}
};
