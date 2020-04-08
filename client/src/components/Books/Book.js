import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
// import components
import {
	Card,
	CardTitle,
	CardSubtitle,
	CardBody,
	CardText,
	CardDeck,
	Button,
	Col,
} from "reactstrap";

const Book = (props) => {
	const userFullName = `${props.userFirstName} ${props.userLastName}`;
	return (
		<Card body outline>
			<CardTitle>{props.title}</CardTitle>
			<CardSubtitle>{props.author}</CardSubtitle>
			<CardText>{userFullName}</CardText>
			<CardText>{props.dateCheckedOut}</CardText>
			<CardText>{props.dateOverdue}</CardText>
		</Card>
	);
};

Book.propTypes = {};

export default Book;
