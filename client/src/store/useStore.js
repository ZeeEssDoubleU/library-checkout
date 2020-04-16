// @ts-nocheck
import React, { createContext, useReducer, useContext, useEffect } from "react";
// import action types
import * as bookActions from "./actions/books";
import * as userActions from "./actions/users";
import * as errorActions from "./actions/errors";

// reducer
const reducer = (state, action) => {
	switch (action.type) {
		case bookActions.types.GET_BOOKS_ALL:
			return { ...state, books_all: action.payload };
		case bookActions.types.GET_BOOKS_AVAILABLE:
			return { ...state, books_available: action.payload };
		case bookActions.types.GET_BOOKS_CHECKED_OUT:
			return { ...state, books_checked_out: action.payload };
		case userActions.types.GET_USERS:
			return { ...state, users: action.payload };
		case userActions.types.GET_USER:
			return { ...state, user: action.payload };
		case userActions.types.LOGIN_USER:
			return { ...state, user_login: action.payload };
		case errorActions.types.LOG_ERRORS:
			return { ...state, errors: action.payload };
		case errorActions.types.CLEAR_ERRORS:
			return { ...state, errors: action.payload };
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
				user_login: null,
				errors: null,
		  }
		: {}; // fallback to {} so that sub states don't return null

// context that stores and shares data
const StoreContext = createContext();

// component to wrap upper level root component with Provider
export const StoreProvider = ({ children }) => {
	const sessionState = JSON.parse(sessionStorage.getItem("sessionState"));
	const [state, dispatch] = useReducer(reducer, sessionState || initState);

	useEffect(() => {
		sessionStorage.setItem("sessionState", JSON.stringify(state));
	}, [state]);

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	);
};

// { useStore } hook.  Acts as Consumer through useContext
export const useStore = () => {
	const { state, dispatch } = useContext(StoreContext);
	return { state, dispatch };
};
