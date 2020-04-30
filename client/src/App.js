import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
// import components
import Nav from "./components/Nav";
import Landing from "./components/Landing";
import Login from "./components/Auths/Login/Login.js";
import Register from "./components/Auths/Register.js";
import AllBooks from "./components/Books/AllBooks.js";
import AvailableBooks from "./components/Books/AvailableBooks.js";
import CheckedOutBooks from "./components/Books/CheckedOutBooks.js";
import Users from "./components/Users/Users.js";
import PrivateRoute from "./components/Auths/PrivateRoute";
// import store/actions
import useStore from "./store/useStore";
import { checkUserLoggedIn } from "./store/actions/users";

function App() {
	const { dispatch } = useStore();
	const history = useHistory();

	// checks if user already logged in
	// if JWT available, checks if expired or not
	useEffect(() => {
		checkUserLoggedIn(history, dispatch);
	}, []);

	return (
		<>
			<Nav />
			<Switch>
				<Route exact path="/">
					<Landing />
				</Route>
				<Route exact path="/login">
					<Login />
				</Route>
				<Route exact path="/register">
					<Register />
				</Route>
				<Route exact path="/books/all">
					<AllBooks />
				</Route>
				<Route exact path="/books/available">
					<AvailableBooks />
				</Route>
				<PrivateRoute exact path="/books/checked-out">
					<CheckedOutBooks />
				</PrivateRoute>
				<Route exact path="/users">
					<Users />
				</Route>
			</Switch>
		</>
	);
}

export default App;
