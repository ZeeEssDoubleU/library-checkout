import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
// import components
import User from "./User";
// import store, actions
import useStore from "../../store/useStore.js";
import { getUsers } from "../../store/actions/users";

const Users = (props) => {
	const { state, dispatch } = useStore();

	useEffect(() => {
		getUsers(dispatch);
	}, []);

	const dislayUsers =
		state.users &&
		state.users.map((user) => (
			<User
				key={user.id}
				firstName={user.first_name}
				lastName={user.last_name}
				email={user.email}
			/>
		));

	return <Grid>{dislayUsers}</Grid>;
};

Users.propTypes = {};

export default Users;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 18em);
	grid-gap: 1em;
	justify-content: center;

	margin: 2em;
`;
