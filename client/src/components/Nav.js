import React from "react";
import styled from "styled-components";
import { Navbar, NavbarBrand, Nav, NavItem, Button, NavLink } from "reactstrap";

const Navigation = props => {
	return (
		<Navbar color="light" light>
			<NavbarBrand href="/">Library Checkout</NavbarBrand>
			<Nav tabs>
				<NavItem>
					<NavLink href="/login">Login</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="/books">Books</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="/users">Users</NavLink>
				</NavItem>
			</Nav>
		</Navbar>
	);
};
export default Navigation;
