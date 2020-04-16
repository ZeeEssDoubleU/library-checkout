import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import axios from "axios";
// import components
import { Container, Card, Form, Input, Button, Label } from "reactstrap";
import FormGroup from "./FormGroup";
// import actions/store
import { useStore } from "../../store/useStore.js";
import { loginUser } from "../../store/actions/users";

const Login = (props) => {
	const [login, setLogin] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});

	const loginUser = async (userData) => {
		try {
			await axios.post("/api/users/login", userData);
		} catch (error) {
			setErrors(error.response.data);
		}
	};

	const onChange = (event) => {
		setLogin({
			...login,
			[event.target.name]: event.target.value,
		});
	};

	// useEffect(() => {
	// 	// validate request
	// 	const { errors, isValid } = validateLogin(login);
	// 	setErrors(errors);
	// }, [login]);

	const onSubmit = (event) => {
		event.preventDefault();
		loginUser(login);
	};

	return (
		<Container fluid>
			<StyledCard>
				<Form onSubmit={onSubmit} noValidate>
					<FormGroup
						required
						name="email"
						type="email"
						label="Email"
						value={login.email}
						onChange={onChange}
						error={errors.email}
					/>
					<FormGroup
						required
						name="password"
						type="password"
						label="Password"
						value={login.password}
						onChange={onChange}
						error={errors.password}
					/>
					<ButtonGroup>
						<StyledButton color="success" tyoe="submit">
							Login
						</StyledButton>
						<StyledButton color="primary" href="/register">
							Register
						</StyledButton>
					</ButtonGroup>
				</Form>
			</StyledCard>
		</Container>
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
