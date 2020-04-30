export const actionTypes = {
	CLEAR_ERRORS: "CLEAR_ERRORS",
	LOG_ERRORS: "LOG_ERRORS",
};

// clear errors
export const clearErrors = async (dispatch) => {
	dispatch({
		type: actionTypes.CLEAR_ERRORS,
		payload: null,
	});
};

// log errors
export const logErrors = async (errors, dispatch) => {
	dispatch({
		type: actionTypes.LOG_ERRORS,
		payload: errors,
	});
};
