const axios = require("axios");


(async () => {
	console.log("Start");

	const data = await axios.post("http://localhost:3000/api/v1/report", {
		title: "test",
		reason: "test123",
		type: 0,
		author: "alvin0319"
	}, {
		headers: {
			"Content-Type": "application/json"
		}
	});
	console.log(data.data);
})();