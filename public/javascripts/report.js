$(document).ready(function(){
	$("#form").on('submit', (e) => {
		e.preventDefault();

		const title = $("#title").val();
		const report_type = $("#report_type").val();
		const reason = $("#reason").val();

		if(!title || !report_type || !reason){
			$("#result").val("모든 값을 정확히 입력해주세요.");
			return;
		}
		if(title.length > 10){
			$("#result").val("제목은 10자 미만이어야 합니다.");
			return;
		}

		const xhr = new XMLHttpRequest();

		xhr.onreadystatechange = () => {
			const data = JSON.parse(xhr.responseText);
			switch(xhr.status){
				case 200:
					window.location = `/report?id=${data.result.articleId}`;
					break;
				case 401:
				case 500:
				default:
					$("#result").val("내부 서버 오류입니다.");
					console.log(data);
					break;
			}
		}
		xhr.open("POST", "/api/v1/report");
		const formData = new FormData();
		formData.append("title", title);
		formData.append("reason", reason);
		formData.append("type", parseInt(report_type));
		xhr.send(formData);
	});
});