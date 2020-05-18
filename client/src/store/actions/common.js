import jwt_decode from "jwt-decode";
// import actions
import { accessToken_refresh } from "./auth";

// if token exists, apply to ALL request auth headers
export const setRequestHeaders = () => {
	const token = localStorage.jwt_access ? localStorage.jwt_access : null;

	return {
		headers: { Authorization: token ? `Bearer ${token}` : null },
	};
};

export const saveAccessTokenToClient = (jwt_access, history, dispatch) => {
	// decode token to get user data and set login_user state
	const decoded = jwt_decode(jwt_access);
	const expiration = decoded.exp * 1000; // s -> ms
	const now = Date.now(); // ms
	const duration = expiration - now; // ms

	// store token in local storage
	localStorage.setItem("jwt_access", jwt_access);
	localStorage.setItem("jwt_access_expiry", expiration);

	console.log("-----------------------------");
	console.log("Access token saved to client.");
	console.log("-----------------------------");

	// TODO: need to update so keeps refreshing when page reloaded
	const timeout = setTimeout(
		() => accessToken_refresh(history, dispatch),
		0.95 * duration,
	);
};
