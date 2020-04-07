import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styled from "styled-components";
// import components
import Book from "./Book";


const CheckedOutBooks = (props) => {
	return <Grid></Grid>;
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
