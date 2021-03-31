$(document).ready(function(){
	const queries = parseQueries();
	const id = queries.id ?? 1;
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		switch(xhr.status){
			case 200:
				const data = JSON.parse(xhr.responseText);
				const result = data.result;
				$("#card_description")
					.text(`#${id}번 제보 (${result.author}님 제보)<br>${result.title}<br><br>종류: ${result.type}<br>${result.reason}`);
				break;
		}
	}
	xhr.open("GET", `/api/v1/report?articleId=${id}`);
	xhr.send();
});