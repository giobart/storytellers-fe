API_GATEWAY = "http://localhost:8081"
LOGIN_API = "/login"
SIGNUP_API = "/signup"
LOGOUT_API = "/logout"
STORIES_API = "/stories"
REACT_API = "/react"
USER_STORY_LIST = "/users/id/stories"
FRONT_END = "http://localhost:5000"
PUT_STORY_LINK = ""

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
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success: function (e) {
            window.location.href = LOGIN_API
        },
        error: function (errMsg) {
            sessionStorage.setItem("username", "")
            sessionStorage.setItem("password", "")
            sessionStorage.setItem("id", -1)
            window.location.href = LOGIN_API
        }
    });
}


function story_list() {
    USER_STORY_LIST=USER_STORY_LIST.replace("id", sessionStorage.getItem("id"));

    $.ajax({
        type: "GET",
        url: API_GATEWAY + USER_STORY_LIST,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType: "json",
        success: story_callback,
        error: function (errMsg) {
            $("#story-list").append("<h1> No stories found </h1>")
        }
    });
}

function story_callback(data, status, xhr) {

    data.forEach(story => {
        story = new StoryComponent($('#story-list'), 1)
        story.theme = story.theme
        story.text = story.text
        story.date = story.date
        story.author = get_username(story.authorId)
        story.authorId = story.author_id
        story.likes = story.likes
        story.dislikes = story.dislikes
        story.currentUser = ''
        story.onDeleteStoryCallback = function () {}
    });

}

function story_render(storyid) {
    $.ajax({
        type: "GET",
        url: API_GATEWAY + STORIES_API + '/' + storyid,
        crossDomain: true,
        success: single_story_callback,
        error: function (errMsg) {
            $("#message").show()
        }
    });
}

function single_story_callback(data, status, xhr) {

    body = $.parseJSON(data)
    story = new BigStoryComponent($('#story-container'), storyId)
    story.theme = body.theme
    story.text = body.text
    story.date = body.date
    story.authorId = body.author_id
    story.author = get_username(story.authorId)
    story.likes = body.likes
    story.dislikes = body.dislikes
    story.currentUser = ''
    story.diceSet= body.dice_set
    story.onLikeCallback = like
    story.onDislikeCallback = dislike
    story.render()

}

function get_username(userid) {
    $.ajax({
    type: "GET",
    url: API_GATEWAY + USERS_API,
    crossDomain: true,
    success: function(data) {
        var body = $.parseJSON(data)
        return body.username
    },
    error: function (errMsg) {
        $("#message").show()
    }
});
}

function like(evt) {
    //react(storyId, 'like')
    react(evt.data.param1, 'like')
}

function dislike(evt) {
    react(evt.data.param1, 'dislike')
}

function react(url, val) {
    let formData = new FormData()
    var payload = {}
    formData.append('react', val)
    formData.forEach((value, key) => {payload[key] = value});
    var json = JSON.stringify(payload)
    url = API_GATEWAY + STORIES_API + '/' + storyId + REACT_API
    fetch(url, {method: 'POST', body: json})
        .then(response => {
            code = response.status
            response.json()
        })
        .then(data => {
            if (val === 'like') {
                story.likes++;
                if (data.message === 'Reaction updated')
                    story.dislikes--;
            }
            else {
                story.dislikes++;
                if (data.message === 'Reaction updated')
                    story.likes--;
            }
            story.update()
        })
        .catch(msg => {
            if (code != 400 && code != 404 && code != 403 && code != 410)
                msg = 'An error occurred while processing your request. Please try again later.'
            $('#message').text(msg)
    })
}

function deleteCallback() {
    $.ajax({
        type: "DELETE",
        url: API_GATEWAY + STORIES_API,       
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success: () => window.location.replace(API_GATEWAY + STORIES_API),
        error: function (errMsg) {
            $("#message").show()
        }
    });
}

function roll_dice() {
    dice = {
        dicenum: $("btn btn-secondary active").text(),
        diceset: $("btn btn-dark text-white").val()
    }
    $.ajax({
        type: "POST",
        data: JSON.stringify(dice),
        url: API_GATEWAY + STORIES_API,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success: roll_dice_callback,
        error: function (errMsg) {
            $("#message").show()
        }
    });
}

function roll_dice_callback(data, status, xhr) {
    body = $.parseJSON(data)
    PUT_STORY_LINK = body.story
    params = link.split('/')
    storyId = params[params.length-1]
    dice_set = ''
    theme = ''
    $.ajax({
        type: "GET",
        url: PUT_STORY_LINK,
        dataType: "json",
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success: function(data) {
            var body = $.parseJSON(data)
            dice_set = body.dice_set
            theme = body.theme
        },
        error: function (errMsg) {
            $("#message").show()
        }
    });
    story = new BigStoryComponent($('#edit-story-container'), storyId)
    story.dice_set = dice_set
    story.theme = theme
}

function cancel_draft() {
    window.location.replace(API_GATEWAY + STORIES_API)
}

function submit() {
    submit_story(0)
}

function submit_draft() {
    submit_story(1)
}

function submit_story(is_draft) {
    story = {
        text: $("#textarea").text(),
        draft: is_draft
    }
    $.ajax({
        type: "PUT",
        data: JSON.stringify(story),
        url: PUT_STORY_LINK,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success: () => {window.location.replace(API_GATEWAY + STORIES_API)},
        error: function (errMsg) {
            $("#message").show()
        }
    });
}