import axios from "axios";

export const types = {
	CLEAR_ERRORS: "CLEAR_ERRORS",
	LOG_ERRORS: "LOG_ERRORS",
};

// clear errors
export const clearErrors = async (dispatch) => {
	dispatch({
		type: types.CLEAR_ERRORS,
		payload: null,
	});
};

// log errors
export const logErrors = async (errors, dispatch) => {
	dispatch({
		type: types.LOG_ERRORS,
		payload: errors,
	});
};
