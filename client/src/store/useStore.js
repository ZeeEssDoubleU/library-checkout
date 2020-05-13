// @ts-nocheck
import React, { createContext, useReducer, useContext, useEffect } from "react";
import isEmpty from "lodash/fp/isEmpty";
import axios from "axios";
// import action types
import { actionTypes as actionTypes_books } from "./actions/books";
import {
	actionTypes as actionTypes_users,
	getCurrentUser,
} from "./actions/users";
import { actionTypes as actionTypes_errors, logErrors } from "./actions/errors";
import { getUser_current } from "./actions/users";

// reducer
const reducer = (state, action) => {
	switch (action.type) {
		// *** book actions
		case actionTypes_books.GET_BOOKS_ALL:
			return { ...state, books_all: action.payload };
		case actionTypes_books.GET_BOOKS_AVAILABLE:
			return { ...state, books_available: action.payload };
		case actionTypes_books.GET_BOOKS_CHECKED_OUT:
			return { ...state, books_checked_out: action.payload };
		// *** user actions
		case actionTypes_users.GET_USERS:
			return { ...state, users: action.payload };
		case actionTypes_users.GET_USER:
			return { ...state, user: action.payload };
		case actionTypes_users.SET_CURRENT_USER:
			return {
				...state,
				user_current: action.payload,
				isAuthenticated: !isEmpty(action.payload),
			};
		// *** error actions
		case actionTypes_errors.LOG_ERRORS:
			return {
				...state,
				errors: {
					...state.errors,
					...action.payload,
				},
			};
		case actionTypes_errors.CLEAR_ERRORS:
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
				user_current: null,
				isAuthenticated: false,
				errors: null,
				getCurrentUser: false,
		  }
		: {}; // fallback to {} so that sub states don't return null

// context that stores and shares data
const StoreContext = createContext();

// component to wrap upper level root component with Provider
export const StoreProvider = ({ children }) => {
	// if sessionState available, load session state (previously saved store)
	const sessionState = JSON.parse(sessionStorage.getItem("sessionState"));
	// choose starting state (based on presence of sessionState)
	const startState = sessionState ? sessionState : initState;
	const [state, dispatch] = useReducer(reducer, {
		...initState,
		user_current: startState.user_current,
		isAuthenticated: startState.isAuthenticated,
		getCurrentUser: startState.getCurrentUser,
	});

	// save store to sessionStorage
	useEffect(() => {
		sessionStorage.setItem(
			"sessionState",
			JSON.stringify({
				user_current: state.user_current,
				isAuthenticated: state.isAuthenticated,
				getCurrentUser: state.getCurrentUser,
			}),
		);
	}, [state]);

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	);
};

// useStore hook.  Acts as Consumer through useContext
export default () => {
	const { state, dispatch } = useContext(StoreContext);
	return { state, dispatch };
};
