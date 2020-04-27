import passport from "passport";
import bcrypt from "bcrypt";
// import controllers
import { findUser } from "../api/users/controllers";
// import strategies
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

// local strategy
passport.use(
	new LocalStrategy(
		{ usernameField: `email` },
		async (email, password, done) => {
			try {
				// find user
				const user = await findUser({ email });

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

// jwt strategy
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
opts.issuer = "accounts.examplesoft.com";
opts.audience = "yoursite.net";
passport.use(
	new JwtStrategy(opts, function (jwt_payload, done) {
		User.findOne({ id: jwt_payload.sub }, function (err, user) {
			if (err) {
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
				// or you could create a new account
			}
		});
	}),
);

// serialize/deserialize user
passport.serializeUser((user, done) => {
	return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		// find user
		const user = await findUser({ id });
		return done(null, user);
	} catch (err) {
		console.error(`Error when selecting user on session deserialize`, err);
		return done(err);
	}
});

export default passport;
