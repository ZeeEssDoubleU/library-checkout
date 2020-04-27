import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// session related imports
import flash from "express-flash";
import session from "express-session";
import passport from "passport";

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
import books from "./api/books/routes";
import users from "./api/users/routes";
app.use("/api/books", books);
app.use("/api/users", users);

// listen to server and confirm in consoles
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});
