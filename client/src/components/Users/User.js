import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
// import components
import {
	Card,
	CardTitle,
	CardSubtitle,
	CardDeck,
	Button,
	Col,
} from "reactstrap";

const User = (props) => {
	const fullName = `${props.firstName} ${props.lastName}`;
	return (
		<Card body outline>
			<CardTitle>{fullName} </CardTitle>
			<CardSubtitle>{props.email}</CardSubtitle>
		</Card>
	);
};

User.propTypes = {};

export default User;
