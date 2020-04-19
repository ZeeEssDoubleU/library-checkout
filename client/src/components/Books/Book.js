import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEmpty from "lodash/fp/isEmpty";
import { format } from "date-fns/fp";
// import components
import {
	Col,
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardBody,
	CardText,
	Button,
} from "reactstrap";

const Book = (props) => {
	// check for first or last name and combine into full name.  Trim extra whitespace, if any
	const userFullName =
		(props.userFirstName || props.userLastName) &&
		`${props.userFirstName} ${props.userLastName}`.trim();

	const formatDate = (date) => {
		const local = new Date(date);
		const formatDate = format("M-d-yyyy")(local);
		const formatTime = format("E, h:mm a")(local);
		return `${formatDate}\n${formatTime}`;
	};

	return (
		<Card outline>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
				<CardSubtitle>{props.author}</CardSubtitle>
			</CardHeader>
			<CardBody>
				{!isEmpty(userFullName) && (
					<pre>
						Checked out to:
						<br />
						{userFullName}
					</pre>
				)}
				{!isEmpty(props.dateCheckedOut) && (
					<pre>
						Checkout date:
						<br />
						{formatDate(props.dateCheckedOut)}
					</pre>
				)}
				{!isEmpty(props.dateOverdue) && (
					<pre>
						Overdue date:
						<br />
						{formatDate(props.dateOverdue)}
					</pre>
				)}
			</CardBody>
		</Card>
	);
};

Book.propTypes = {};
export default Book;
