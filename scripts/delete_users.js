const mysql = require("mysql-await");


(async () => {
	const connection = mysql.createConnection(require("../config.json"));

	const res = await connection.awaitQuery("DROP TABLE IF EXISTS `users`");

	console.log(res);
	process.exit(0);
})()
	.catch((e) => {
		console.error(e);
		process.exit(0);
	});