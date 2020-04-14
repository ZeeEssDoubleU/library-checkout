import axios from "axios";

export const types = {
	GET_USERS: "GET_USERS",
	GET_USER: "GET_USER",
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
		console.error(error);
	}
};

// register user
export const registerUser = async (userData, history) => {
	try {
		const response = await axios.post("/api/users/register", userData);
		console.log("New user:", response.data);
	} catch (error) {
		console.error(error);
	}
};
