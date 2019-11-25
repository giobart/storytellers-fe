API_GATEWAY = "http://localhost:8081"
LOGIN_API = "/login"
SIGNUP_API = "/signup"
FRONT_END = "http://localhost:5000"

function login() {
    user = {
        username: $("#username").val(),
        password: $("#password").val()
    }

    sessionStorage.setItem("tmp_username", user.username)
    sessionStorage.setItem("tmp_password", user.password)

    $.ajax({
        type: "POST",
        url: API_GATEWAY + LOGIN_API,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(user),
        xhrFields: {withCredentials: true},
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: login_response_callback,
        error: function (errMsg) {
            $("#credentialError").show()
        }
    });

}

function login_response_callback(data, status, xhr) {

    if (xhr.status==200) {
        sessionStorage.setItem("username", sessionStorage.getItem("tmp_username"))
        sessionStorage.setItem("password", sessionStorage.getItem("tmp_password"))
        window.location.href = '/';
    } else {
        $("#credentialError").show()
    }

}

function signup() {
    new_user = {
        email: $("#email").val(),
        username: $("#username").val(),
        password: $("#password").val()
    }

    $('#signup-error').show()

    // Login automatically on Signup?
    //sessionStorage.setItem("tmp_username", user.username)
    //essionStorage.setItem("tmp_password", user.password)

    $.ajax({
        type: "POST",
        url: API_GATEWAY + SIGNUP_API,
        // The key needs to match ysour method's input parameter (case-sensitive).
        data: JSON.stringify(new_user),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: signup_response_callback,
        error: function (errMsg) {
            $('#signupError').show();
        }
    });

}

function signup_response_callback(data, status, xhr) {

    if (xhr.status==200) {
        //Redirect to the Login page
        window.location.href = LOGIN_API;

    } else {
        $('#signupError').show()
    }

}