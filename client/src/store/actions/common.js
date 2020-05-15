// if token exists, apply to ALL request auth headers
export const setRequestHeaders = () => {
	const token = localStorage.jwt ? localStorage.jwt : null;

	return {
		headers: { Authorization: token ? `Bearer ${token}` : null },
	};
};
