const {createWriteStream} = require("fs");
const fs = require("fs");

class Logger{
	/** @param {WriteStream} */
	stream;

	debugMessage = false;

	constructor(debug = false){
		this.debugMessage = debug;
		this.stream = createWriteStream(dir + "web.log", {
			flags: 'a',
			encoding: null,
			mode: 0o666
		});
	}

	async info(message){
		const format = `[${new Date()}] [INFO] ${message}`;
		console.log(format);
		await this.stream.write(format + "\n");
	}

	async debug(message){
		const format = `[${new Date()}] [DEBUG] ${message}`;
		if(this.debugMessage){
			console.log(format);
		}
		await this.stream.write(format + "\n");
	}

	close(){
		this.info("Terminating logger...");
		this.stream.end();
		console.log(`[${new Date()}] [INFO] Terminating logger success`);
	}
}

module.exports = Logger;