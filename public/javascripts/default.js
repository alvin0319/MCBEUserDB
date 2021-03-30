const parseQueries = () => {
	const queries = window.location.search.substring(1);
	const vars = queries.split("&");
	const res = {};
	for(let i = 0; i < vars.length; i++){
		const [key, value] = vars[i].split("=");
		res[key] = value;
	}
	return res;
}