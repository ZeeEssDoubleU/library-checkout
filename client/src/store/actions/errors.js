export const actionTypes_errors = {
	CLEAR_ERRORS: "CLEAR_ERRORS",
	LOG_ERRORS: "LOG_ERRORS",
};

// clear errors
export const clearErrors = async (dispatch) => {
	dispatch({
		type: actionTypes_errors.CLEAR_ERRORS,
		payload: null,
	});
};

// log errors
export const logErrors = async (errors, dispatch) => {
	dispatch({
		type: actionTypes_errors.LOG_ERRORS,
		payload: errors,
	});
};
