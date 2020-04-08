import axios from "axios";

export const types = {
	GET_USERS: "GET_USERS",
	GET_USER: "GET_USER",
};

// get all users
export const getUsers = async (dispatch) => {
	try {
		const response = await axios({
			url: "api/users",
			baseURL: "/",
		});
		dispatch({
			type: types.GET_USERS,
			payload: response.data,
		});
	} catch (error) {
		console.error(error);
	}
};
