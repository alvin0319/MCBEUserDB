$(document).ready(function(){
	$("#form").on('submit', (e) => {
		e.preventDefault();
		const mail = $("#mail").val();
		const username = $("#username").val();
		const password = $("#password").val();

		if(!username || !password || !mail){
			alert("메일과 아이디, 비밀번호를 입력해주세요.");
			return;
		}

		if(username.length > 20){
			alert("아이디는 20자를 초과할 수 없습니다.");
			return;
		}

		if(password.length > 15){
			alert("비밀번호는 15자를 초과할 수 없습니다.");
			return;
		}

		if(password.length < 4){
			alert("비밀번호는 4자 이상이어야 합니다.");
			return;
		}

		if(!new RegExp(/^[a-z0-9]*$/i).test(password)){
			console.log(new RegExp(/^[a-z0-9]*$/i).test(password))
			alert("비밀번호는 영문 + 숫자로만 입력할 수 있습니다.");
			return;
		}

		const xhr = new XMLHttpRequest();

		const formData = new FormData();

		formData.append("mail", mail);
		formData.append("username", username);
		formData.append("password", password);

		xhr.onreadystatechange = () => {
			const data = JSON.parse(xhr.responseText);
			switch(data.status){
				case 200:
					window.location = "/";
					break;
				case 401:
					alert("해당 이름의 계정이 이미 존재합니다.");
					break;
				case 500:
					alert("Internal server error");
					break;
				default:
					alert("서버에서 알 수 없는 상태를 반환했습니다.");
					break;
			}
		};

		xhr.open("POST", "/register");
		xhr.send(formData);
	});
});