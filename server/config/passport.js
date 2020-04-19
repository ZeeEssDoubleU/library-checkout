const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { findUser } = require("../api/users/helpers");

passport.use(
	new LocalStrategy(
		{ usernameField: "email", passwordField: "password" },
		async (username, password, done) => {
			try {
				// find user
				const user = await findUser({ email: username });
				if (!user) {
					// if no user found, return false (error message)
					return done(null, false, {
						message: "Passport - Incorrect email (username).",
					});
				} else {
					console.log(`Found user: ${user.email}.`);
					// compare passwords
					const match = await bcrypt.compare(password, user.password);
					if (match) {
						// if match, return user
						return done(null, user, {
							message: `Passport - Success! Logged in as user: ${user}.`,
						});
					} else {
						// if no match, return false (error message)
						return done(null, false, {
							message: "Passport - Incorrect password.",
						});
					}
				}
			} catch (err) {
				return done(err, {
					message: `Passport - server error: ${err}`,
				});
			}
		},
	),
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		// find user
		const user = await findUser({ id });
		done(err, user);
	} catch (err) {
		console.error("Error when selecting user on session deserialize", err);
		return done(err);
	}
});

module.exports = passport;
