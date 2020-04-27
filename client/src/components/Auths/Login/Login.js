import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
// import components
import { Container, Card, Form, Button } from "reactstrap";
import FormGroup from "../FormGroup";
import Local from "./Local";
import Jwt from "./Jwt";
// import validation
import validateLogin from "../../../validate/login";
// import actions/store
import { useStore } from "../../../store/useStore.js";
import { loginUser } from "../../../store/actions/users";

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

const StyledCard = styled(Card)`
	margin: 2rem;
`;
const ButtonGroup = styled.div`
	margin: 1em;
`;
const StyledButton = styled(Button)`
	margin-right: 1em;
`;
