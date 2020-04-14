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

const Login = (props) => {
	return (
		<Container fluid>
			<LoginCard>
				<Form>
					<FormGroup>
						<Label for="email">Email</Label>
						<Input type="email" id="email" />
					</FormGroup>
					<FormGroup>
						<Label for="password">Password</Label>
						<Input type="password" id="password" />
					</FormGroup>
					<FormGroup>
						<StyledButton color="success">Login</StyledButton>
						<StyledButton color="primary" href="/register">
							Register
						</StyledButton>
					</FormGroup>
				</Form>
			</LoginCard>
		</Container>
	);
};

Login.propTypes = {};

export default Login;

const LoginCard = styled(Card)`
	margin: 2rem;
`;
const FormGroup = styled.div`
	margin: 1em;
`;
const Grid = styled.div`
	display: flex;
	justify-content: center;
`;
const StyledButton = styled(Button)`
	margin-right: 1em;
`;
