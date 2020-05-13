import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// session related imports
import flash from "express-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./config/passport";

const server = express();
const { PORT = 5000, SESSION_SECRET } = process.env;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());
// set up session
server.use(flash()); // required to flash messages from passport.js
server.use(
	session({
		secret: `${process.env.SESSION_SECRET}`,
		resave: false,
		saveUninitialized: false,
	}),
); // required for passport sessions
server.use(cookieParser());
// initialize session
server.use(passport.initialize());
server.use(passport.session());

// import and use routes
import routes_auth from "./api/auth/routes";
import routes_users from "./api/users/routes";
import routes_books from "./api/books/routes";
server.use("/api/auth", routes_auth);
server.use("/api/users", routes_users);
server.use("/api/books", routes_books);

// custom error handler
server.use((error, req, res, next) => {
	const caughtError = {
		status: error.status || 500,
		message: error.message || `Internal server error.`,
		stack: error.stack || new Error(),
	};
	console.error(caughtError);
	res.status(caughtError.status).json(caughtError);
});

// listen to server and confirm in consoles
server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});
