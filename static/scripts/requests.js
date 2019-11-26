API_GATEWAY = "http://localhost:8081"
LOGIN_API = "/login"
SIGNUP_API = "/signup"
LOGOUT_API = "/logout"
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

    if (xhr.status == 200) {
        sessionStorage.setItem("username", sessionStorage.getItem("tmp_username"))
        sessionStorage.setItem("password", sessionStorage.getItem("tmp_password"))
        sessionStorage.setItem("id", parseInt(data.id))
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
            if (errMsg.responseJSON.code == "E029U")
                $('#name-error').show()
            else
                $('#mail-error').show()
        }
    });

}

function signup_response_callback(data, status, xhr) {

    switch (xhr.status) {
        case 200:
            // Here 'replace' since we don't want the user to go back to the signup page.
            window.location.href = LOGIN_API
        case 409:
            if (xhr.response.error == '9E')
                $('#name-error').show()
            else
                $('#mail-error').show()
            break
    }

}

function logout() {
    $.ajax({
        type: "POST",
        url: API_GATEWAY + LOGOUT_API,
        // The key needs to match ysour method's input parameter (case-sensitive).
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success: function(e){window.location.href = LOGIN_API},
        error: function (errMsg) {
            sessionStorage.setItem("username", "")
            sessionStorage.setItem("password", "")
            sessionStorage.setItem("id", -1)
            window.location.href = LOGIN_API
        }
    });
}


function story_list() {
    new_user = {
        email: $("#email").val(),
        username: $("#username").val(),
        password: $("#password").val(),
    }

    $.ajax({
        type: "POST",
        url: API_GATEWAY + SIGNUP_API,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        // The key needs to match ysour method's input parameter (case-sensitive).
        data: JSON.stringify(new_user),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: signup_response_callback,
        error: function (errMsg) {
            if (errMsg.responseJSON.code == "E029U")
                $('#name-error').show()
            else
                $('#mail-error').show()
        }
    });
}