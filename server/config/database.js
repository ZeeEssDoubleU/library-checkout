import { Pool } from "pg";
import rateLimit from "express-rate-limit";

// check if in production, if so require env variables
export const isProduction = process.env.NODE_ENV === "production";
// require dotenv if in development
if (!isProduction) {
	require("dotenv").config();
}

const connectionString = isProduction
	? process.env.DATABASE_URL
	: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// database variable, will be used to query database throughout app
export const db = new Pool({
	connectionString,
	ssl: isProduction,
});

// server addons
// TODO adjust server options
export const corsOptions = isProduction ? "" : "*";

export const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 min
	max: 5, // max 5 requests
});
export const postLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 min
	max: 1, // max 5 requests
});
