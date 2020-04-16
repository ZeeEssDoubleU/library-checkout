const { isEmail, isLength, equals } = require("validator");
const isEmpty = require("lodash/fp/isEmpty");

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
	} else if (!isLength(password, { min: 8, max: 64 })) {
		errors.password = "Password must be between 8 and 64 characters.";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateLogin;
