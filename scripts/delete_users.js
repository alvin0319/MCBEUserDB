const mysql = require("mysql-await");
const fs = require("fs");

(async () => {
	const connection = mysql.createConnection(JSON.parse(fs.readFileSync("config.json").toString()));

	const res = await connection.awaitQuery("DROP TABLE IF EXISTS `users`");

	console.log(res);
	process.exit(0);
})()
	.catch((e) => {
		console.error(e);
		process.exit(0);
	});