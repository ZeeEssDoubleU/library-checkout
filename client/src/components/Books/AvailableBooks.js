import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
// import components
import Book from "./Book";
// import store, actions
import useStore from "../../store/useStore.js";
import { getBooks_available } from "../../store/actions/books";

const AllBooks = (props) => {
	const { state, dispatch } = useStore();

	useEffect(() => {
		if (!state.books_available) {
			getBooks_available(state, dispatch);
		}
	}, [state.books_available]);

	const displayBooks =
		state.books_available &&
		state.books_available.map((book) => (
			<Book key={book.id} title={book.title} author={book.author} />
		));

	return <Grid>{displayBooks}</Grid>;
};

AllBooks.propTypes = {};

export default AllBooks;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 18em);
	grid-gap: 1em;
	justify-content: center;

	margin: 2em;
`;
