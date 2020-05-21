import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { useHistory, NavLink as NavLink_rr } from "react-router-dom";
import styled from "styled-components";
// import store / actions
import useStore from "../store/useStore";
import { logoutUser, accessToken_refresh } from "../store/actions/auth";

const Navigation = (props) => {
	const { state, dispatch } = useStore();
	const history = useHistory();

	const onLogoutClick = (event) => {
		event.preventDefault();
		logoutUser(history, state, dispatch);

		// to support logging out from all tabs
		// tried putting in the logout user function, but was creating infinite loop
		localStorage.setItem("logout", Date.now());
	};

	// allows logging out across all open tabs
	// listens to local storage and logs out across all tabs if localStorage.logout exists
	const syncLogout = async (event) => {
		if (localStorage.logout) {
			await logoutUser(history, state, dispatch);
			history.push("/login");
			localStorage.removeItem("logout");
		}
	};
	window.addEventListener("storage", syncLogout); // listen to localStorage

	return (
		<Navbar color="light" light>
			<NavbarBrand tag={NavLink_rr} to="/">
				Library Checkout
			</NavbarBrand>
			<Nav tabs>
				<NavItem>
					{!state.isAuthenticated ? (
						<NavLink tag={NavLink_rr} to="/login">
							Login
						</NavLink>
					) : (
						<NavLink tag={NavLink_rr} to="" onClick={onLogoutClick}>
							Logout
						</NavLink>
					)}
				</NavItem>
				<NavItem>
					<NavLink tag={NavLink_rr} to="/books/all">
						All Books
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink tag={NavLink_rr} to="/books/available">
						Available Books
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink tag={NavLink_rr} to="/books/checked-out">
						Checked Out Books
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink tag={NavLink_rr} to="/users">
						Users
					</NavLink>
				</NavItem>
			</Nav>
		</Navbar>
	);
};
export default Navigation;
