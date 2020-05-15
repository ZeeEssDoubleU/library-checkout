import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button, Card, CardHeader, Container } from "reactstrap";
import axios from "axios";
// import components
import Jwt from "./Jwt";
// import Local from "./Local - deprecated"; // ! deprecated: local login
// import store / actions
import useStore from "../../../store/useStore";
import { getUser_current } from "../../../store/actions/users";

const Login = (props) => {
	const { state, dispatch } = useStore();
	const history = useHistory();

	return (
		<>
			<Container fluid>
				<Card_Styled>
					<CardHeader>Social Login</CardHeader>
					<ButtonGroup>
						<SocialLink color="primary" href="/api/auth/login/facebook">
							Facebook
						</SocialLink>
						<SocialLink color="danger" href="/api/auth/login/google">
							Google
						</SocialLink>
					</ButtonGroup>
				</Card_Styled>
			</Container>
			<Jwt />
			{/* <Local /> // ! deprecated: local login */}
		</>
	);
};
Login.propTypes = {};

const Card_Styled = styled(Card)`
	margin: 2em;
`;
const ButtonGroup = styled.div`
	margin: 1em;
`;
const SocialLink = styled(Button)`
	margin-right: 1em;
`;

export default Login;
