const mysql = require("mysql-await");


(async () => {
	const connection = mysql.createConnection(require("./config.json"));

	const res = await connection.awaitQuery("SELECT * FROM `users` where `id` = 'alvin0319'");

	console.log(res);
	process.exit(0);
})()
	.catch((e) => {
		console.error(e);
		process.exit(0);
	});