const mysql = require("mysql-await");
const {escape} = require("mysql");
const {writeFileSync, readFileSync} = require("fs");
const bcrypt = require("bcrypt");

class Database{

	connection;

	id = 0;

	constructor(){
		this.connection = mysql.createConnection(require(dir + "config.json"));
		this.connection.awaitQuery("CREATE TABLE IF NOT EXISTS `users` (`id` VARCHAR(20) NOT NULL PRIMARY KEY, `mail` TEXT NOT NULL, `password` TEXT NOT NULL)");
		this.connection.awaitQuery("CREATE TABLE IF NOT EXISTS `articles` (`id` INT NOT NULL PRIMARY KEY, `title` VARCHAR(15) NOT NULL, `type` INT NOT NULL, `reason` TEXT NOT NULL)");

		this.id = JSON.parse(readFileSync(dir + "article.json").toString("utf-8")).id ?? 0;
	}

	/**
	 * @param {string} id
	 * @returns {Promise<{password: *, mail: *, id: *}>}
	 */
	async fetchUser(id){
		id = escape(id);
		const res = await this.connection.awaitQuery(`SELECT * FROM \`users\` WHERE \`id\` = ${id}`);
		return {
			id: res[0].id,
			mail: res[0].mail,
			password: res[0].password
		};
	}

	async fetchUserByMail(mail){
		mail = escape(mail);
		const res = await this.connection.awaitQuery(`SELECT * FROM \`users\` WHERE \`mail\` = ${mail}`);
		return {
			id: res[0].id,
			mail: res[0].mail,
			password: res[0].password
		};
	}

	async createUser(id, mail, password){
		[id, mail] = [id, mail].map((k) => escape(k));

		const saltRounds = 10;

		let hash = await bcrypt.hash(password, saltRounds);

		hash = escape(hash);

		await this.connection.awaitQuery(`INSERT INTO \`users\` (\`id\`, \`mail\`, \`password\`) VALUES (${id}, ${mail}, ${hash})`);

		await logger.debug(`Creating user ${id}`);
	}

	close(){
		this.connection.awaitEnd();
		writeFileSync(dir + "article.json", JSON.stringify({id: this.id}));
	}

	async fetchArticle(id){
		id = escape(id);
		const res = await this.connection.awaitQuery(`SELECT * FROM \`articles\` WHERE \`id\` = ${id}`);
		return {
			id: res[0].id,
			title: res[0].title,
			type: res[0].type,
			reason: res[0].reason
		};
	}

	async createArticle(title, type, reason){
		[title, type, reason] = [title, type, reason].map((k) => escape(k));
		this.id += 1;
		await this.connection.awaitQuery(`INSERT INTO \`articles\` (\`id\`, \`title\`, \`type\`, \`reason\`) VALUES (${this.id}, ${title}, ${type}, ${reason})`);
		await logger.debug(`Creating article ${this.id}`);
		return this.id;
	}

	async fetchArticles(){
		const res = await this.connection.awaitQuery("SELECT * FROM `articles`");
		const result = [];
		for(const article of res){
			result.push({
				id: article.id,
				title: article.title,
				type: article.type,
				reason: article.reason
			});
		}
		return result;
	}
}

module.exports = Database;