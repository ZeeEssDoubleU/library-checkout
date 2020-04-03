import React from "react";
import PropTypes from "prop-types";
import { Container, Jumbotron } from "reactstrap";

const Landing = props => {
	return (
		<Jumbotron>
			<Container fluid>This is the landing page</Container>
		</Jumbotron>
	);
};

Landing.propTypes = {};

export default Landing;
