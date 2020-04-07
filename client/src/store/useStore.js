// @ts-nocheck
import React, { createContext, useReducer, useContext } from "react";
import axios from "axios";
// import action types
import * as bookActions from "./actions/books";
import * as userActions from "./actions/users";

// reducer
const reducer = (state, action) => {
	switch (action.type) {
		case bookActions.types.GET_BOOKS_ALL:
			return { ...state, books_all: action.payload };
		case userActions.types.GET_USERS:
			return { ...state, users: action.payload };
		default:
			return state;
	}
};

// initial state
const initState =
	typeof window !== "undefined"
		? {
				books_all: null,
				books_available: null,
				books_checked_out: null,
				book: null,
				users: null,
				user: null,
		  }
		: {}; // fallback to {} so that sub states don't return null

// context that stores and shares data
const StoreContext = createContext(initState);

// component to wrap upper level root component with Provider
export const StoreProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initState);

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	);
};

// useStore hook.  Acts as Consumer through useContext
export const useStore = () => {
	const { state, dispatch } = useContext(StoreContext);
	return { state, dispatch };
};
