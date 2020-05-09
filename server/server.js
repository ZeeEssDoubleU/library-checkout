import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// session related imports
import flash from "express-flash";
import session from "express-session";
import passport from "./config/passport";

const app = express();
const { PORT = 5000, SESSION_SECRET } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// set up session
app.use(flash()); // required to flash messages from passport.js
app.use(
	session({
		secret: `${process.env.SESSION_SECRET}`,
		resave: false,
		saveUninitialized: false,
	}),
); // required for passport sessions
// initialize session
app.use(passport.initialize());
app.use(passport.session());

// default route message
app.route("/").get((req, res) => {
	res.json({
		info: "Library checkout system using Node.js, Express and Postgres.",
	});
});

// import and use routes
import routes_auth from "./api/auth/routes";
import routes_users from "./api/users/routes";
import routes_books from "./api/books/routes";
app.use("/api/auth", routes_auth);
app.use("/api/users", routes_users);
app.use("/api/books", routes_books);

// custom error handler
app.use((error, req, res, next) => {
	const caughtError = {
		status: error.status || 500,
		message: error.message || `Internal server error.`,
		stack: error || null,
	};
	console.error(caughtError);
	res.status(caughtError.status).json(caughtError);
});

// listen to server and confirm in consoles
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});
