import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route, Redirect, useHistory } from "react-router-dom";
// import store
import useStore from "../../store/useStore";

const PrivateRoute = ({ children, ...props }) => {
	const { state, dispatch } = useStore();
	const history = useHistory();

	return (
		<Route {...props}>
			{state.isAuthenticated === true ? children : <Redirect to="/login" />}
		</Route>
	);
};

PrivateRoute.propTypes = {};

export default PrivateRoute;
