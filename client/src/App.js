import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
// import components
import Nav from "./components/Nav";
import Landing from "./components/Landing";
import Login from "./components/Auths/Login.js";
import Register from "./components/Auths/Register.js";
import AllBooks from "./components/Books/AllBooks.js";
import AvailableBooks from "./components/Books/AvailableBooks.js";
import CheckedOutBooks from "./components/Books/CheckedOutBooks.js";
import Users from "./components/Users/Users.js";

function App() {
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
				<Route exact path="/books/checked-out">
					<CheckedOutBooks />
				</Route>
				<Route exact path="/users">
					<Users />
				</Route>
			</Switch>
		</>
	);
}

export default App;
