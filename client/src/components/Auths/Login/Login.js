import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "reactstrap";
// import components
import Local from "./Local";
import Jwt from "./Jwt";

const Login = (props) => {
	return (
		<>
			<SocialLink color="primary" href="/api/auth/login/facebook">
				Facebook
			</SocialLink>
			<Local />
			<Jwt />
		</>
	);
};
Login.propTypes = {};

const SocialLink = styled(Button)`
	margin: 24px 48px;
`;

export default Login;
