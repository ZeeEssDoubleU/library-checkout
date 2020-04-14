import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
// import components
import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardBody,
	Button,
	Col,
} from "reactstrap";

const User = (props) => {
	const fullName = `${props.firstName} ${props.lastName}`;
	return (
		<Card outline>
			<CardHeader>
				<CardTitle>{fullName} </CardTitle>
			</CardHeader>
			<CardBody>
				<CardSubtitle>
					Email: <br />
					{props.email}
				</CardSubtitle>
			</CardBody>
		</Card>
	);
};

User.propTypes = {};

export default User;
