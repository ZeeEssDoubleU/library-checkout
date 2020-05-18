import React, { useEffect, Fragment, memo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useHistory } from "react-router-dom";
// import store / actions
import useStore from "../../store/useStore";
import { getUser_current } from "../../store/actions/users";

const OAuthCallback = memo((props) => {
	const { state, dispatch } = useStore();
	const history = useHistory();

	const getCurrentUser = async () => {
		await getUser_current(history, dispatch);
		// wait for response to push history
		history.push("/books/checked-out");
	};

	// get current user
	useEffect(() => {
		getCurrentUser();
	}, []);

	return <Fragment />;
});

OAuthCallback.propTypes = {};

export default OAuthCallback;
