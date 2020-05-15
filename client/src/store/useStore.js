// @ts-nocheck
import React, { createContext, useContext, useReducer, useEffect } from "react";
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
		  }
		: {}; // fallback to {} so that sub states don't return null

// context that stores and shares data
const StoreContext = createContext();

// component to wrap upper level root component with Provider
export const StoreProvider = ({ children }) => {
	// if persistedState available, load session state (previously saved store)
	const persistedState = JSON.parse(localStorage.getItem("persistedState"));
	// choose starting state (based on presence of persistedState)
	const startState = persistedState || initState;

	const [state, dispatch] = useReducer(reducer, {
		...initState,
		user_current: startState.user_current,
		isAuthenticated: startState.isAuthenticated,
	});

	// save store to localStorage
	useEffect(() => {
		localStorage.setItem(
			"persistedState",
			JSON.stringify({
				user_current: state.user_current,
				isAuthenticated: state.isAuthenticated,
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
