import React from "react";
import PropTypes from "prop-types";
// import components
import Local from "./Local";
import Jwt from "./Jwt";

const Login = (props) => {
	return (
		<>
			<Local />
			<Jwt />
		</>
	);
};
Login.propTypes = {};

export default Login;
