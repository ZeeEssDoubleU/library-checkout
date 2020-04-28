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
const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
	secretOrKey: process.env.JWT_SECRET,
};
passport.use(
	new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			// find user
			const user = await findUser({ id: jwt_payload.id });

			// if user, return user
			if (user) {
				return done(null, user, {
					type: `success`,
					message: `User confirmed.`,
				});
			} else {
				return done(null, false, {
					type: `jwt`,
					message: `JSON web token not authorized.`,
				});
			}
		} catch (err) {
			return done(err, {
				type: `passport`,
				message: `Passport - jwt strategy: ${err}`,
			});
		}
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
