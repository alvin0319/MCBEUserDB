const axios = require("axios");


(async () => {
	console.log("Start");
	/*
	const data = await axios.post("http://localhost:3000/api/v1/report", {
		title: "test",
		reason: "test123",
		type: 0
	}, {
		headers: {
			"Content-Type": "application/json"
		}
	});
	console.log(data.data);
	 */
	const data = await axios.get("http://localhost:3000/api/v1/reports?page=1");
	console.log(data.data);
})();