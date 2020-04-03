import React from "react";
import PropTypes from "prop-types";
// import components
import { Card, CardTitle, CardSubtitle, CardDeck, Button } from "reactstrap";

const Book = props => {
	return (
		<Card>
			<CardTitle>{props.title}</CardTitle>
			<CardSubtitle>{props.subtitle}</CardSubtitle>
		</Card>
	);
};

Book.propTypes = {};

export default Book;
