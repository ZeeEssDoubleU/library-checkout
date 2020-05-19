import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
// import components
import { Container, Card, Form, Button } from "reactstrap";
import FormGroup from "./FormGroup";
// import validation
import validateRegister from "../../validate/register";
// import actions/store
import useStore from "../../store/useStore";
import { registerUser } from "../../store/actions/auth";
import { logErrors } from "../../store/actions/errors";

const Register = (props) => {
	const { state, dispatch } = useStore();
	const history = useHistory();
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password_confirm: "",
		submitted: false,
	});
	const [errors, setErrors] = useState({});

	// update formData state input change
	const onChange = (event) => {
		// collect new updated formData as newUser
		const newUser = {
			...formData,
			[event.target.name]: event.target.value,
		};
		// validate formData and log errors when formData changes
		const { errors: clientErrors } = validateRegister(newUser);
		setFormData(newUser);
		logErrors({ register: clientErrors }, dispatch);
	};

	// register formData on form submit
	const onSubmit = async (event) => {
		event.preventDefault();
		// register user and await reponse if errors
		registerUser(formData, history, state, dispatch);
		setFormData({
			...formData,
			submitted: true,
		});
	};

	// if global errors present, show on related ui
	useEffect(() => {
		setErrors(state.errors?.register);
	}, [state.errors]);

	return (
		<Container fluid>
			<StyledCard>
				<Form onSubmit={onSubmit} noValidate>
					<FormGroup
						required
						name="first_name"
						type="text"
						label="First Name"
						value={formData.first_name}
						onChange={onChange}
						error={errors?.first_name}
						submitted={formData.submitted}
					/>
					<FormGroup
						required
						name="last_name"
						type="text"
						label="Last Name"
						value={formData.last_name}
						onChange={onChange}
						error={errors?.last_name}
						submitted={formData.submitted}
					/>
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
					<FormGroup
						required
						name="password_confirm"
						type="password"
						label="Confirm Password"
						value={formData.password_confirm}
						onChange={onChange}
						error={errors?.password_confirm}
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
