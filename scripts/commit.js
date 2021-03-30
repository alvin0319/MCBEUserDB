const child_process = require("child_process");

const fs = require("fs");

const readline = require("readline");

const path = require("path");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

(async () => {
	const data = JSON.parse(fs.readFileSync("config.json").toString());

	const originalData = data;

	data.host = "";
	data.user = "";
	data.password = "";
	data.database = "";

	fs.writeFileSync("config.json", JSON.stringify(data));

	//await child_process.exec("cd ..");
	child_process.exec("git add .", async (err, a, b) => {
		console.log("Commit message: ");

		const l = rl[Symbol.asyncIterator]();

		const line = await l.next();

		child_process.exec(`git commit -m "${line.value}"`, (err, a, b) => {
			console.log(a, b);
			child_process.exec("git push origin master", (err, a, b) => {
				console.log(a, b);
				fs.writeFileSync(path.resolve("config.json"), JSON.stringify(originalData));

				console.log("Done");
				process.exit(0);
			});
		});
	});
})();