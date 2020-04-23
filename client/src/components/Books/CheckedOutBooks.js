import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
// import components
import Book from "./Book";
// import store, actions
import { useStore } from "../../store/useStore.js";
import { getCheckedOutBooks } from "../../store/actions/books";
import { useHistory } from "react-router-dom";

const CheckedOutBooks = (props) => {
	const { state, dispatch } = useStore();
	const history = useHistory();

	useEffect(() => {
		getCheckedOutBooks(dispatch, history);
	}, []);

	const displayBooks =
		state.books_checked_out &&
		state.books_checked_out.map((book) => (
			<Book
				key={book.id}
				title={book.title}
				author={book.author}
				userFirstName={book.user_first_name}
				userLastName={book.user_last_name}
				dateCheckedOut={book.date_checkout}
				dateOverdue={book.date_overdue}
			/>
		));

	return <Grid>{displayBooks}</Grid>;
};

CheckedOutBooks.propTypes = {};

export default CheckedOutBooks;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 18em);
	grid-gap: 1em;
	justify-content: center;

	margin: 2em;
`;
