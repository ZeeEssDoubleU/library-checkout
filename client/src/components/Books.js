import React, { useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
// import components
import { Container, Jumbotron } from "reactstrap";

const Books = props => {
	useEffect(() => {
		getBooks();
	}, []);

	const getBooks = async () => {
		try {
			const response = await axios.get(`api/books`);
			console.log("books", response);
		} catch (error) {
			console.error(error);
		}
	};

	return <Container fluid>This is the books page</Container>;
};

Books.propTypes = {};

export default Books;
