import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
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

const Register = (props) => {
	return (
		<Container fluid>
			<LoginCard>
				<Form>
					<FormGroup>
						<StyledLabel for="email">Email</StyledLabel>
						<Input type="email" id="email" />
					</FormGroup>
					<FormGroup>
						<StyledLabel for="password">Password</StyledLabel>
						<Input type="password" id="password" />
					</FormGroup>
					<FormGroup>
						<StyledLabel for="confirm-password">
							Confirm Password
						</StyledLabel>
						<Input type="password" id="confirm-password" />
					</FormGroup>
					<FormGroup>
						<StyledButton>Submit</StyledButton>
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
