const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");


router.get("/", function(req, res, next){
	res.render('index', {
		isAuthenticated: typeof req.session.userId !== "undefined"
	});
});

router.get("/login", (req, res, next) => {
	if(typeof req.session.userId !== "undefined"){
		return res.redirect("/");
	}
	res.render("login", {
		isAuthenticated: typeof req.session.userId !== "undefined",
		err: ""
	});
});

router.post("/login", (req, res, next) => {
	const body = req.body;

	database.fetchUser(body.username)
		.then((data) => {
			const saltRounds = 10;

			bcrypt.hash(body.password, saltRounds)
				.then((hash) => {
					bcrypt.compare(body.password, hash, (err, result) => {
						if(result){
							req.session.userId = body.username;
							return res.redirect("/");
						}
						res.render("login", {
							err: "아이디가 존재하지 않거나 비밀번호가 일치하지 않습니다."
						});
					});
				})
				.catch((e) => {
					res.render("login", {
						err: "아이디가 존재하지 않거나 비밀번호가 일치하지 않습니다."
					});
				});
		})
		.catch((e) => {
			res.render("login", {
				err: "아이디가 존재하지 않거나 비밀번호가 일치하지 않습니다."
			});
		});

});

router.get("/logout", (req, res, next) => {
	if(req.session.userId){
		req.session.destroy();
		res.clearCookie(process.env.SESSION_KEY);
		return res.redirect("/");
	}
	return res.redirect("/");
});

router.get("/register", (req, res, next) => {
	if(typeof req.session.userId !== "undefined"){
		return res.redirect("/");
	}
	res.render("register", {
		err: ""
	});
});

router.post("/register", (req, res, next) => {
	if(typeof req.session.userId !== "undefined"){
		return res.redirect("/");
	}
	const body = req.body;

	console.log(body);

	const id = body.username;
	const mail = body.mail;
	const password = body.password;


	if(id.trim() === "" || mail.trim() === "" || password.trim() === ""){
		return res.render("register", {
			err: "모든 칸을 작성해주세요."
		})
	}

	database.fetchUser(id)
		.then((a_) => res.render("register", {
			err: "해당 아이디가 이미 존재합니다."
		}))
		.catch((b_) => {
			database.fetchUserByMail(mail)
				.then((c_) => res.render("register", {
					err: "해당 메일이 이미 존재합니다."
				}))
				.catch((d_) => {
					database.createUser(id, mail, password)
						.then((e_) => {
							res.redirect("/");
						})
						.catch((f_) => {
							res.render("register", {
								err: f_.message
							});
							console.error(f_);
						});
				});
		});
});

router.get("/reports", (req, res, next) => {
	res.render("reports", {
		isAuthenticated: typeof req.session.userId !== "undefined",
	});
});

router.get("/doreport", (req, res, next) => {
	if(typeof req.session.userId === "undefined"){
		return res.redirect("/");
	}
	res.render("article", {
		isAuthenticated: typeof req.session.userId !== "undefined"
	});
});

router.post("/postarticle", (req, res, next) => {
	if(typeof req.session.userId === "undefined"){
		return res.redirect("/");
	}
	const body = req.body;

	const title = body.title;
	const report_type = body.report_type;
	const reason = body.reason;

	database.createArticle(req.session.userId, title, report_type, reason)
		.then((articleId) => {
			res.redirect(`/report?id=${articleId}`);
		})
		.catch((e) => {
			res.render("article", {
				isAuthenticated: typeof req.session.userId !== "undefined",
				err: e.message
			});
		});
});

router.get("/report", (req, res, next) => {
	res.render("report", {
		isAuthenticated: typeof req.session.userId !== "undefined"
	})
});

module.exports = router;
