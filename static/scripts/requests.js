API_GATEWAY = "http://localhost:8081"
LOGIN_API = "/login"

function login() {
    user = {
        username: $("#username").val(),
        password: $("#password").val()
    }

    $('#login-error').show()

    sessionStorage.setItem("tmp_username", user.username)
    sessionStorage.setItem("tmp_password", user.password)

    $.ajax({
        type: "POST",
        url: API_GATEWAY + LOGIN_API,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(user),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: login_response_callback,
        failure: function (errMsg) {
            $('#login-error').show();
        }
    });

}

function login_response_callback(data, status, xhr) {

    if (status == 200) {
        sessionStorage.setItem("username", sessionStorage.getItem("tmp_username"))
        sessionStorage.setItem("password", sessionStorage.getItem("tmp_password"))
        //window.location.href = '/';
    } else {
        $('#credential-error').show()
    }

}