import jwt_decode from "jwt-decode";

// if token exists, apply to ALL request auth headers
export const setRequestHeaders = (state, timeoutDuration = 0) => {
	const token = state.jwt_access;

	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : null,
			timeoutDuration,
		},
	};
};
