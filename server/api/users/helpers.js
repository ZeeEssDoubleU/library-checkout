const { pool } = require(`../../config/database`);

const findUser = async (input) => {
	const key = Object.keys(input)[0];

	const result = await pool.query(
		`SELECT * FROM public.user WHERE ${key} = $1`,
		[input[key]],
	);
	return result.rows[0];
};

module.exports = { findUser };
