import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styled from "styled-components";
// import components
import Book from "./Book";

const AvailableBooks = (props) => {
	return <Grid></Grid>;
};

AvailableBooks.propTypes = {};

export default AvailableBooks;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 18em);
	grid-gap: 1em;
	justify-content: center;

	margin: 2em;
`;
