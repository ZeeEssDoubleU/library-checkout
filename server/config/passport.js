const passport = require(`passport`);
const LocalStrategy = require(`passport-local`).Strategy;
const bcrypt = require(`bcrypt`);
const controllers_users = require(`../api/users/controllers`);

passport.use(
	new LocalStrategy(
		{ usernameField: `email` },
		async (email, password, done) => {
			try {
				// find user
				const user = await controllers_users.findUser({ email });

				// if no user found, return false with error message
				if (!user) {
					return done(null, false, {
						type: `email`,
						message: `No user found with that email.`,
					});
				}

				// compare passwords
				const match = await bcrypt.compare(password, user.password);
				// remove encrypted password for security
				delete user.password;

				if (match) {
					// if match, return success
					return done(null, user, {
						type: `success`,
						message: `Logged in as user: ${user}.`,
					});
				} else {
					// if no match, return false with error message
					return done(null, false, {
						type: `password`,
						message: `Password is incorrect :(`,
					});
				}
			} catch (err) {
				return done(err, {
					type: `passport`,
					message: `Passport - local strategy: ${err}`,
				});
			}
		},
	),
);

passport.serializeUser((user, done) => {
	return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		// find user
		const user = await controllers_users.findUser({ id });
		return done(null, user);
	} catch (err) {
		console.error(`Error when selecting user on session deserialize`, err);
		return done(err);
	}
});

module.exports = passport;
