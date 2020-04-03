const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// default route message
app.route("/").get((req, res) => {
	res.json({
		info: "Library checkout system using Node.js, Express and Postgres.",
	});
});

// import and use routes
const books = require("./routes/books");
const users = require("./routes/users");
app.use("/api/books", books);
app.use("/api/users", users);

// listen to server and confirm in consoles
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});
