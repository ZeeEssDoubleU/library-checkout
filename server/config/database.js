const { Pool } = require("pg");
const rateLimit = require("express-rate-limit");

// check if in production, if so require env variables
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) require("dotenv/config");

const connectionString = isProduction
	? process.env.DATABASE_URL
	: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const db = new Pool({
	connectionString,
	ssl: isProduction,
});

// TODO adjust isProduction option
const corsOptions = isProduction ? "" : "*";

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 min
	max: 5, // max 5 requests
});
const postLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 min
	max: 1, // max 5 requests
});

module.exports = {
	isProduction,
	db,
	corsOptions,
	limiter,
	postLimiter,
};
