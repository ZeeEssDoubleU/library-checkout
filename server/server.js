const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// session related imports
const session = require("express-session");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// // set up session
// app.use(
// 	session({
// 		secret: process.env.SECRET,
// 		resave: false,
// 		saveUninitialized: false,
// 	}),
// );
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
const books = require("./api/books/routes");
const users = require("./api/users/routes");
app.use("/api/books", books);
app.use("/api/users", users);

// listen to server and confirm in consoles
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});
