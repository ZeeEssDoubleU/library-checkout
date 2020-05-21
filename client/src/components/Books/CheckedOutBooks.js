import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import axios from "axios";
// import components
import Book from "./Book";
// import store, actions
import useStore from "../../store/useStore.js";
import { getBooks_checkedOut } from "../../store/actions/books";

const CheckedOutBooks = (props) => {
	const { state, dispatch } = useStore();

	useEffect(() => {
		if (state.jwt_access && !state.books_checked_out) {
			getBooks_checkedOut(state, dispatch);
		}
	}, [state.jwt_access, state.books_checked_out]);

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

	const buttonClick = async (event) => {
		event.preventDefault();
		await axios.get("/api/auth/access-token/refresh");
	};

	return (
		<Grid>
			{/* <TestButton onClick={buttonClick}>TEST TEST TEST</TestButton> */}
			{displayBooks}
		</Grid>
	);
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

const TestButton = styled.button`
	background: none;
	border: 1px solid black;
	border-radius: 1em;
`;
