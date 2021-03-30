function addCard(id, text, author, url = ""){
	if(url !== ""){
	}else{
		$("#cards")
			.append($("<div>", {
					class: "row"
				})
					.append($("<div>", {
							class: "col s12 m6"
						})
							.append($("<div>", {
									class: "card blue-grey darken-1"
								})
									.append($("<div>", {
											class: "card-content white-text"
										})
											.append($("<span>", {
													class: "card-title",
													html: `#${id}, 제보자: ${author}`
												})
											)
											.append($("<p>", {})
												.text(text))
									)
									.append($("<div>", {
											class: "card-action"
										})
											.append(`<a href="/report?id=${id}">제보 보러가기</a>`)
									)
							)
					)
			);
	}
}

$(document).ready(function(){
	const queries = parseQueries();
	const page = queries.page ?? 1;
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		switch(xhr.status){
			case 200:
				const data = JSON.parse(xhr.responseText);
				const result = data.result;
				//console.log(result);
				for(const report of result){
					addCard(report.id, report.reason, report.author, '');
				}
				break;
			case 500:
			default:
				alert("Internal server error");
				break;
		}
	}
	xhr.open("GET", `/api/v1/reports?page=${page}`);
	xhr.send();
});
