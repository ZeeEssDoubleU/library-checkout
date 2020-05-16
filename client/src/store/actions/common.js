// if token exists, apply to ALL request auth headers
export const setRequestHeaders = () => {
	const token = localStorage.jwt_access ? localStorage.jwt_access : null;

	return {
		headers: { Authorization: token ? `Bearer ${token}` : null },
	};
};
