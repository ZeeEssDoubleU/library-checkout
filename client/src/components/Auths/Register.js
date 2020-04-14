import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import axios from "axios";
// import components
import {
	Container,
	Card,
	Form,
	Input,
	Button,
	ButtonGroup,
	Label,
} from "reactstrap";
// import action
import { registerUser } from "../../store/actions/users";

const Register = (props) => {
	const history = useHistory();
	const [newUser, setNewUser] = useState({
		first_name: null,
		last_name: null,
		email: null,
		password: null,
		password_confirm: null,
	});

	const onChange = (event) => {
		setNewUser({
			...newUser,
			[event.target.name]: event.target.value,
		});
	};

	const onSubmit = (event) => {
		event.preventDefault();
		registerUser(newUser, history);
	};

	return (
		<Container fluid>
			<LoginCard>
				<Form onSubmit={onSubmit} method="POST">
					<FormGroup>
						<StyledLabel for="first_name">First Name</StyledLabel>
						<Input
							type="first_name"
							name="first_name"
							onChange={onChange}
						/>
					</FormGroup>
					<FormGroup>
						<StyledLabel for="last_name">Last Name</StyledLabel>
						<Input
							type="last_name"
							name="last_name"
							onChange={onChange}
						/>
					</FormGroup>
					<FormGroup>
						<StyledLabel for="email">Email</StyledLabel>
						<Input type="email" name="email" onChange={onChange} />
					</FormGroup>
					<FormGroup>
						<StyledLabel for="password">Password</StyledLabel>
						<Input type="password" name="password" onChange={onChange} />
					</FormGroup>
					<FormGroup>
						<StyledLabel for="password_confirm">
							Confirm Password
						</StyledLabel>
						<Input
							type="password"
							name="password_confirm"
							onChange={onChange}
						/>
					</FormGroup>
					<FormGroup>
						<StyledButton color="success" type="submit">
							Submit
						</StyledButton>
						<StyledButton color="danger" onClick={() => history.goBack()}>
							Cancel
						</StyledButton>
					</FormGroup>
				</Form>
			</LoginCard>
		</Container>
	);
};

Register.propTypes = {};

export default Register;

const LoginCard = styled(Card)`
	margin: 2rem;
`;
const FormGroup = styled.div`
	margin: 1em;
`;
const StyledLabel = styled(Label)``;
const Grid = styled.div`
	display: flex;
	justify-content: center;
`;
const StyledButton = styled(Button)`
	margin-right: 1em;
`;
