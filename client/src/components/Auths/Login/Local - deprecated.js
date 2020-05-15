import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
// import components
import { Container, Card, CardHeader, Form, Button } from "reactstrap";
import FormGroup from "../FormGroup";
// import validation
import validateLogin from "../../../validate/login";
// import actions/store
import useStore from "../../../store/useStore.js";
// import { loginUser_local } from "../../../store/actions/auth";
import { logErrors } from "../../../store/actions/errors";

const Local = (props) => {
	const { state, dispatch } = useStore();
	const history = useHistory();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		submitted: false,
	});
	const [errors, setErrors] = useState({});

	// update formData state input change
	const onChange = (event) => {
		// collect new updated formData as user
		const user = {
			...formData,
			[event.target.name]: event.target.value,
		};
		// validate formData and log errors when formData changes
		const { errors: clientErrors } = validateLogin(user);
		setFormData(user);
		logErrors({ login_local: clientErrors }, dispatch);
	};

	// register formData on form submit
	const onSubmit = async (event) => {
		event.preventDefault();
		// register user and await reponse if errors
		loginUser_local(formData, history, dispatch);
		setFormData({
			...formData,
			submitted: true,
		});
	};

	// if global errors present, show on related ui
	useEffect(() => {
		setErrors(state.errors?.login_local);
	}, [state.errors]);

	return (
		<Container fluid>
			<Card_Styled>
				<CardHeader>Login Local</CardHeader>
				<Form onSubmit={onSubmit} noValidate>
					<FormGroup
						required
						name="email"
						type="email"
						label="Email"
						value={formData.email}
						onChange={onChange}
						error={errors?.email}
						submitted={formData.submitted}
					/>
					<FormGroup
						required
						name="password"
						type="password"
						label="Password"
						value={formData.password}
						onChange={onChange}
						error={errors?.password}
						submitted={formData.submitted}
					/>
					<ButtonGroup>
						<Button_Styled color="success" type="submit">
							Login
						</Button_Styled>
						<Button_Styled color="primary" href="/register">
							Register
						</Button_Styled>
					</ButtonGroup>
				</Form>
			</Card_Styled>
		</Container>
	);
};

Local.propTypes = {};

export default Local;

const Card_Styled = styled(Card)`
	margin: 2rem;
`;
const ButtonGroup = styled.div`
	margin: 1em;
`;
const Button_Styled = styled(Button)`
	margin-right: 1em;
`;
