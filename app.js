/*
 * Defines global variable
 */
global.dir = __dirname + "/";

require("dotenv").config();

const _logger = require("./utils/logger");
const Logger = new _logger(process.env.DEBUG === "true");
global.logger = Logger;

const _database = require("./utils/database");
const Database = new _database();
global.database = Database;

const http = require("http");

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const session = require("express-session");

const indexRouter = require('./routes/index');
const apiRouter = require("./routes/api");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	key: process.env.SESSION_KEY,
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: parseInt(process.env.SESSION_EXPIRE)
	}
}));

//app.use(require("multer"));

app.use(async (req, res, next) => {
	const ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);
	const url = req.url;
	await Logger.debug(`${ip} : ${url} (${req.statusCode})`);
	next();
});

app.use('/', indexRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next){
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next){
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

require("readline")
	.createInterface({
		input: process.stdin,
		output: process.stdout
	})
	.on("line", (line) => {
		if(line.toLowerCase() === "stop"){
			process.exit(0);
		}
	});

process.once("exit", () => {
	Database.close();
	Logger.close();
});

const server = http.createServer(app);

server.listen(port = process.env.HTTP_PORT ?? 3000, () => Logger.info(`Starting web server on port ${port}`));