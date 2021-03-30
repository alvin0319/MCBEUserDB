const express = require('express');
const router = express.Router();

router.get("/report", async (req, res, next) => {
	const articleId = req.query.articleId;
	if(!articleId){
		res.writeHead(401);
		res.json({
			status: 401,
			message: "Query articleId not found"
		});
		return;
	}
	try{
		const article = await database.fetchArticle(articleId);
		return res.json({
			status: 200,
			result: article
		});
	}catch(e){
		res.writeHead(401);
		res.json({
			status: 401,
			message: `Failed to find article #${articleId}`
		});
	}
});

router.post("/report", (req, res, next) => {
	const body = req.body;
	const title = body.title;
	const reason = body.reason;
	const type = body.type;
	const author = body.author;

	if(!author){
		return res.json({
			status: 401,
			message: "Bad access"
		});
	}

	database.fetchUser(author)
		.then((result) => {
			if(type < 0 || type > 4){
				return res.json({
					status: 401,
					message: "type must be range 0~4"
				});
			}

			if(!title || !reason){
				return res.json({
					status: 401,
					message: "Invalid body received"
				});
			}
			database.createArticle(title, type, reason)
				.then((articleId) => {
					res.json({
						status: 200,
						result: {
							articleId: articleId
						}
					});
				}).catch((e) => {
				console.error(e);
				res.json({
					status: 401,
					message: "Internal server error"
				});
			});
		})
		.catch((e) => {
			return res.json({
				status: 401,
				message: "User not found"
			});
		});
});

router.get("/reports", async (req, res, next) => {
	let page = req.query.page ?? 1;

	const perPage = req.query.per_page ?? 5;

	const articles = await database.fetchArticles();

	const maxPage = Math.ceil(articles.length / page);

	if(page > maxPage){
		page = maxPage;
	}

	const result = Object.values(articles)
		.slice((page - 1) * perPage, perPage);

	res.json({
		page: page,
		result: result
	});
});

module.exports = router;