import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
// import components
import { Container, Card, Form, Button } from "reactstrap";
import FormGroup from "./FormGroup";
// import validation
import validateLogin from "../../validate/login";
// import actions/store
import { useStore } from "../../store/useStore.js";
import { loginUser } from "../../store/actions/users";

const Login = (props) => {
	const { dispatch } = useStore();
	const history = useHistory();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		submitted: false,
		errors: {},
	});

	// update formData state input change
	const onChange = (event) => {
		// collect new updated formData as user
		const user = {
			...formData,
			[event.target.name]: event.target.value,
		};
		// validate formData and log errors when formData changes
		const { errors } = validateLogin(user);
		setFormData({
			...user,
			errors,
		});
	};

	// register formData on form submit
	const onSubmit = async (event) => {
		event.preventDefault();
		// register user and await reponse if errors
		const response = await loginUser(formData, history, dispatch);
		setFormData({
			...formData,
			submitted: true,
			errors: response,
		});
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
						value={formData.email}
						onChange={onChange}
						error={formData.errors?.email}
						submitted={formData.submitted}
					/>
					<FormGroup
						required
						name="password"
						type="password"
						label="Password"
						value={formData.password}
						onChange={onChange}
						error={formData.errors?.password}
						submitted={formData.submitted}
					/>
					<ButtonGroup>
						<StyledButton color="success" type="submit">
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
