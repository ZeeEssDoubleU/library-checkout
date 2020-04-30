// if token exists, apply to ALL request auth headers
export const setRequestHeaders = () => {
   const token = localStorage.JWT ? localStorage.JWT : null;
   
	return {
		headers: { Authorization: token ? `Bearer ${token}` : null },
	};
};
