const { isEmail, isLength, equals } = require("validator");
const isEmpty = require("lodash/fp/isEmpty");

const validateRegister = (data) => {
	let errors = {};

	// make sure that data fields are strings for Validator
	const checkString = (input) => {
		return !isEmpty(input) ? input : "";
	};

	const first_name = checkString(data.first_name);
	const last_name = checkString(data.last_name);
	const email = checkString(data.email);
	const password = checkString(data.password);
	const password_confirm = checkString(data.password_confirm);

	// first_name
	if (isEmpty(first_name)) {
		errors.first_name = "First name is required.";
	} else if (!isLength(first_name, { min: 2, max: 64 })) {
		errors.first_name = "First name must be between 2 and 64 characters.";
	}

	// last_name
	if (isEmpty(last_name)) {
		errors.last_name = "Last name is required.";
	} else if (!isLength(last_name, { min: 2, max: 64 })) {
		errors.last_name = "Last name must be between 2 and 64 characters.";
	}

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

	// confirm password
	if (isEmpty(password_confirm)) {
		errors.password_confirm = "Password confirmation is required.";
	} else if (!equals(password, password_confirm)) {
		errors.password_confirm = "Password confirmation must match password.";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateRegister;
