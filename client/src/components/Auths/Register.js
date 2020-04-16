import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import axios from "axios";
// import components
import { Container, Card, Form, Input, Button, Label } from "reactstrap";
import FormGroup from "./FormGroup";
// import validation
import validateRegister from "../../validate/register";
// import actions/store
import { useStore } from "../../store/useStore.js";
import { registerUser } from "../../store/actions/users";
import { clearErrors, logErrors } from "../../store/actions/errors";

const Register = (props) => {
	const { dispatch } = useStore();
	const history = useHistory();
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password_confirm: "",
		submitted: false,
		errors: {},
	});

	// update formData state input change
	const onChange = (event) => {
		// collect new updated formData as newUser
		const newUser = {
			...formData,
			[event.target.name]: event.target.value,
		};
		// validate formData and log errors when formData changes
		const { errors, isValid } = validateRegister(newUser);
		setFormData({
			...newUser,
			errors,
		});
	};

	// register formData on form submit
	const onSubmit = async (event) => {
		event.preventDefault();
		// register user and await reponse if errors
		const response = await registerUser(formData, history, dispatch);
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
						name="first_name"
						type="text"
						label="First Name"
						value={formData?.first_name}
						onChange={onChange}
						error={formData.errors?.first_name}
						submitted={formData.submitted}
					/>
					<FormGroup
						required
						name="last_name"
						type="text"
						label="Last Name"
						value={formData?.last_name}
						onChange={onChange}
						error={formData.errors?.last_name}
						submitted={formData.submitted}
					/>
					<FormGroup
						required
						name="email"
						type="email"
						label="Email"
						value={formData?.email}
						onChange={onChange}
						error={formData.errors?.email}
						submitted={formData.submitted}
					/>
					<FormGroup
						required
						name="password"
						type="password"
						label="Password"
						value={formData?.password}
						onChange={onChange}
						error={formData.errors?.password}
						submitted={formData.submitted}
					/>
					<FormGroup
						required
						name="password_confirm"
						type="password"
						label="Confirm Password"
						value={formData?.password_confirm}
						onChange={onChange}
						error={formData.errors?.password_confirm}
						submitted={formData.submitted}
					/>
					<ButtonGroup>
						<StyledButton color="success" type="submit">
							Submit
						</StyledButton>
						<StyledButton color="danger" onClick={() => history.goBack()}>
							Cancel
						</StyledButton>
					</ButtonGroup>
				</Form>
			</StyledCard>
		</Container>
	);
};

Register.propTypes = {};

export default Register;

const StyledCard = styled(Card)`
	margin: 2rem;
`;
const ButtonGroup = styled.div`
	margin: 1em;
`;
const StyledButton = styled(Button)`
	margin-right: 1em;
`;
