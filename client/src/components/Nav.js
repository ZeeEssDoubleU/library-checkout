import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { useHistory } from "react-router-dom";
// import store / actions
import useStore from "../store/useStore";
import { logoutUser } from "../store/actions/users";

const Navigation = (props) => {
	const { state, dispatch } = useStore();
	const history = useHistory();

	const onLogoutClick = (event) => {
		event.preventDefault();
		logoutUser(history, dispatch);
	};

	return (
		<Navbar color="light" light>
			<NavbarBrand href="/">Library Checkout</NavbarBrand>
			<Nav tabs>
				<NavItem>
					{!state.isAuthenticated ? (
						<NavLink href="/login">Login</NavLink>
					) : (
						<NavLink href="" onClick={onLogoutClick}>
							Logout
						</NavLink>
					)}
				</NavItem>
				<NavItem>
					<NavLink href="/books/all">All Books</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="/books/available">Available Books</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="/books/checked-out">Checked Out Books</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="/users">Users</NavLink>
				</NavItem>
			</Nav>
		</Navbar>
	);
};
export default Navigation;
