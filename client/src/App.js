import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
// import components
import Nav from "./components/Nav";
import Landing from "./components/Landing";
import Login from "./components/Login.js";
import Books from "./components/Books.js";
import Users from "./components/Users.js";

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
				<Route exact path="/books">
					<Books />
				</Route>
				<Route exact path="/users">
					<Users />
				</Route>
			</Switch>
		</>
	);
}

export default App;
