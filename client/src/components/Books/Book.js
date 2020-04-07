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

const Book = (props) => {
	return (
		<Card body outline>
			<CardTitle>{props.title}</CardTitle>
			<CardSubtitle>{props.author}</CardSubtitle>
		</Card>
	);
};

Book.propTypes = {};

export default Book;