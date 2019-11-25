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
        password: $("#password").val(),
    }

    $.ajax({
        type: "POST",
        url: API_GATEWAY + SIGNUP_API,
        // The key needs to match ysour method's input parameter (case-sensitive).
        data: JSON.stringify(new_user),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: signup_response_callback,
        error: function (errMsg) {
            if(errMsg.responseJSON.code=="E029U")
                $('#name-error').show()
            else
                $('#mail-error').show()
        }
    });

}

function signup_response_callback(data, status, xhr) {

    switch(xhr.status) {
        case 200:
            // Here 'replace' since we don't want the user to go back to the signup page.
            window.location.href=LOGIN_API
        case 409:
            if(xhr.response.error == '9E')
                $('#name-error').show()
            else
                $('#mail-error').show()
            break
    }

}