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
// import util
import isEmpty from "../../utils/isEmpty";

const Book = (props) => {
	// check for first or last name and combine into full name.  Trim extra whitespace, if any
	const userFullName =
		(props.userFirstName || props.userLastName) &&
		`${props.userFirstName} ${props.userLastName}`.trim();
	return (
		<Card body outline>
			<CardTitle>{props.title}</CardTitle>
			<CardSubtitle>{props.author}</CardSubtitle>
			{!isEmpty(userFullName) && <CardText>{userFullName}</CardText>}
			{!isEmpty(props.dateCheckedOut) && (
				<CardText>{props.dateCheckedOut}</CardText>
			)}
			{!isEmpty(props.dateOverdue) && (
				<CardText>{props.dateOverdue}</CardText>
			)}
		</Card>
	);
};

Book.propTypes = {};

export default Book;
