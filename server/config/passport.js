import passport from "passport";
import bcrypt from "bcrypt";
// import controllers
import { findUser } from "../api/users/controllers";
// import strategies
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as OAuth2Strategy } from "passport-oauth2";

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
					// add auth type to user
					user.auth = "local";
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
			} catch (error) {
				return done(error, {
					type: `passport`,
					message: `Passport - local strategy: ${error}`,
				});
			}
		},
	),
);

// jwt strategy
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		},
		async (jwt_payload, done) => {
			try {
				// find user
				const user = await findUser({ id: jwt_payload.id });

				// if no user, return 'not authorized'
				if (!user) {
					return done(null, false, {
						type: `jwt`,
						message: `User not authorized.`,
					});
				}

				// if user found, add auth type to user and return user
				user.auth = "jwt";
				return done(null, user, {
					type: `success`,
					message: `User confirmed.`,
				});
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
			try {
				return done(null, profile._json);
			} catch (error) {
				return done(error, {
					type: `passport`,
					message: `Passport - oauth2 facebook: ${error}`,
				});
			}
		},
	),
);

// serialize/deserialize user
passport.serializeUser((user, done) => {
	return done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
	try {
		console.log("deserialize:", email);
		// find user
		const user = await findUser({ email });
		return done(null, user);
	} catch (error) {
		console.error(`Error when selecting user on session deserialize`, error);
		return done(error);
	}
});

export default passport;
