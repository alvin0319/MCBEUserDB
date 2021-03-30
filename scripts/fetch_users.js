const mysql = require("mysql-await");
const fs = require("fs");

(async () => {
	const connection = mysql.createConnection(JSON.parse(fs.readFileSync("/config.json").toString()));

	const res = await connection.awaitQuery("SELECT * FROM `users` where `id` = 'alvin0319'");

	console.log(res);
	process.exit(0);
})()
	.catch((e) => {
		console.error(e);
		process.exit(0);
	});