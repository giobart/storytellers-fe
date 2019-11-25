API_GATEWAY = "http://localhost:8081"
LOGIN_API = "/login"
SIGNUP_API = "/signup"
FRONT_END = "http://localhost:5000"

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

function signup() {
    new_user = {
        email: $("#email").val(),
        username: $("#username").val(),
        password: $("#password").val(),
    }

    $('#signup-error').show()

    $.ajax({
        type: "POST",
        url: API_GATEWAY + SIGNUP_API,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(user),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: signup_response_callback,
        failure: function (errMsg) {
            $('#signup-error').show();
        }
    });

}

function signup_response_callback(data, status, xhr) {

    switch(status) {
        case 200:
            // Here 'replace' since we don't want the user to go back to the signup page.
            window.location.replace(FRONT_END + LOGIN_API)
            break
        case 409:
            if(xhr.response.error == '9E')
                $('#name-error').show()
            else
                $('#mail-error').show()
            break
    }

}