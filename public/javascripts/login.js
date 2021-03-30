$(document).ready(function(){
	$("#form").on('submit', (e) => {
		e.preventDefault();
		const username = $("#username").val();
		const password = $("#password").val();

		if(!username || !password){
			alert("유저명과 비밀번호를 입력해주세요.");
			return;
		}
		const xhr = new XMLHttpRequest();

		const formData = new FormData();

		formData.append("username", username);
		formData.append("password", password);

		xhr.onreadystatechange = () => {
			const data = JSON.parse(xhr.responseText);
			switch(data.status){
				case 200:
					window.location = "/";
					break;
				case 401:
					alert("계정이 존재하지 않거나 비밀번호가 일치하지 않습니다.");
					break;
				case 500:
					alert("Internal server error");
					break;
				default:
					alert("서버에서 알 수 없는 상태를 반환했습니다.");
					break;
			}
		};

		xhr.open("POST", "/login");

		//xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(formData);
	});
});