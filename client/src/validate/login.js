import { isEmail, isLength, equals } from "validator";
import isEmpty from "lodash/fp/isEmpty";

const validateLogin = (data) => {
	let errors = {};

	const email = data.email;
	const password = data.password;

	// email
	if (isEmpty(email)) {
		errors.email = "Email is required.";
	} else if (!isEmail(email)) {
		errors.email = "Email is invalid.";
	}

	// password
	if (isEmpty(password)) {
		errors.password = "Password is required.";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

export default validateLogin;
