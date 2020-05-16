import passport from "passport";
import bcrypt from "bcrypt";
import capitalize from "lodash/fp/capitalize";
// import controllers
import { createUser, findUser } from "../api/users/controllers";
// import strategies
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
// import { Strategy as LocalStrategy } from "passport-local"; // ! deprecated: local login

// ! deprecated: local login
// // local strategy
// passport.use(
// 	new LocalStrategy(
// 		{ usernameField: `email` },
// 		async (email, password, done) => {
// 			try {
// 				// find user
// 				const user = await findUser({ email });

// 				// if no user found, return false with error message
// 				if (!user) {
// 					return done(null, false, {
// 						type: `email`,
// 						message: `No user found with that email.`,
// 					});
// 				}

// 				// compare passwords
// 				const match = await bcrypt.compare(password, user.password);
// 				// remove encrypted password for security
// 				delete user.password;

// 				if (match) {
// 					// if match, return success
// 					return done(null, user, {
// 						type: `success`,
// 						message: `Logged in as user: ${user}.`,
// 					});
// 				} else {
// 					// if no match, return false with error message
// 					return done(null, false, {
// 						type: `password`,
// 						message: `Password is incorrect :(`,
// 					});
// 				}
// 			} catch (error) {
// 				return done(error, {
// 					type: `passport`,
// 					message: `Passport - local strategy: ${error}`,
// 				});
// 			}
// 		},
// 	),
// );

// jwt_access strategy
passport.use(
	new JwtStrategy(
		"jwt_access",
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_ACCESS_SECRET,
		},
		async (jwt_payload, done) => {
			try {
				// check to see if user exists in database
				// ? may not really need this check
				const user = await findUser({ email: jwt_payload.email });

				if (!user) {
					return done(null, false, {
						type: `jwt_access`,
						message: `User NOT found in database.`,
					});
				}

				return done(null, user);
			} catch (error) {
				return done(error, {
					type: `passport`,
					message: `Passport - jwt_access strategy: ${error}`,
				});
			}
		},
	),
);

// jwt_refesh strategy
const extract_jwt_refresh = (req) => {
	return req.cookies && req.cookies.jwt_refresh
		? req.cookies.jwt_refresh
		: null;
};

passport.use(
	new JwtStrategy(
		"jwt_refresh",
		{
			jwtFromRequest: extract_jwt_refresh,
			secretOrKey: process.env.JWT_REFRESH_SECRET,
		},
		async (jwt_payload, done) => {
			try {
				// check to see if user exists in database
				// ? may not really need this check
				const user = await findUser({ email: jwt_payload.email });

				if (!user) {
					return done(null, false, {
						type: `jwt_refresh`,
						message: `User NOT found in database.`,
					});
				}

				return done(null, user);
			} catch (error) {
				return done(error, {
					type: `passport`,
					message: `Passport - jwt strategy: ${error}`,
				});
			}
		},
	),
);

// jwt_access strategy
passport.use(
	new JwtStrategy(
		"jwt_access",
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_ACCESS_SECRET,
		},
		async (jwt_payload, done) => {
			try {
				// check to see if user exists in database
				// ? may not really need this check
				const user = await findUser({ email: jwt_payload.email });

				if (!user) {
					return done(null, false, {
						type: `jwt`,
						message: `User NOT found in database.`,
					});
				}

				return done(null, user);
			} catch (error) {
				return done(error, {
					type: `passport`,
					message: `Passport - jwt strategy: ${error}`,
				});
			}
		},
	),
);

// facebook oauth2
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: process.env.FACEBOOK_APP_CALLBACK,
			profileFields: ["id", "first_name", "last_name", "email"],
		},
		async (accessToken, refreshToken, profile, done) => {
			const { first_name, last_name, email } = profile._json;

			try {
				let user = await findUser({ email });

				// if no user found, create (register) new user in database (without password)
				if (!user) {
					user = await createUser({ first_name, last_name, email });
				}

				return done(null, user);
			} catch (error) {
				return done(error, {
					type: `passport`,
					message: `Passport - oauth2 facebook: ${error}`,
				});
			}
		},
	),
);

// stores desired value into session (email in this case)
// uses value to lookup and login user below
passport.serializeUser((user, done) => {
	return done(null, user.email);
});

// 'logs' user into session
passport.deserializeUser(async (email, done) => {
	try {
		// find user
		const user = await findUser({ email });
		// remove user password so it's not stored in session
		await delete user.password;

		return done(null, user);
	} catch (error) {
		console.error(`Error when selecting user on session deserialize`, error);
		return done(error);
	}
});

export default passport;
