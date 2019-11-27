API_GATEWAY = "http://localhost:8081"
LOGIN_API = "/login"
SIGNUP_API = "/signup"
LOGOUT_API = "/logout"
STORIES_API = "/stories"
STORIES_EDIT = "/stories/ID/edit"
REACT_API = "/react"
USERS_API = "/users"
STATISTICS_API = "/stats"
FOLLOWED_API = "/users/followed"
FOLLOW_API = "/users/ID/follow"
USER_STORY_LIST = "/users/id/stories"
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


function story_list(all = false) {
    PATH = all ? STORIES_API : USER_STORY_LIST.replace("id", sessionStorage.getItem("id"));

    //set filters if any remove set filters from session storage
    filters = sessionStorage.getItem("filters")
    if(filters){
        sessionStorage.setItem("filters","")
    }else{
        filters=""
    }

    $.ajax({
        type: "GET",
        url: API_GATEWAY + PATH + filters,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType: "json",
        success: story_callback,
        error: function (errMsg) {
            if (errMsg.status == 401) {
                logout()
            }
            $("#story-list").append("<h1> No stories found </h1>")
        }
    });
}

function story_callback(data, status, xhr) {

    data.forEach(story => {
        storycomponent = new StoryComponent($('#story-list'), story.id)
        if (story.is_draft) {
            storycomponent.theme = "draft"
        } else {
            storycomponent.theme = story.theme
        }
        storycomponent.text = story.text
        storycomponent.authorValue = sessionStorage.getItem("id")
        storycomponent.date = story.date
        storycomponent.author = 'author'
        storycomponent.authorId = story.author_id
        storycomponent.likes = story.likes
        storycomponent.dislikes = story.dislikes
        storycomponent.currentUser = sessionStorage.getItem("id")
        storycomponent.onDeleteStoryCallback = delete_story
        storycomponent.render()
    });

}

function story_render(storyid) {
    $.ajax({
        type: "GET",
        url: API_GATEWAY + STORIES_API + '/' + storyid,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success: single_story_callback,
        error: function (errMsg) {
            $("#message").show()
        }
    });
}

function single_story_callback(data, status, xhr) {

    body = data
    story = new BigStoryComponent($('#story-container'), storyId)
    story.theme = body.theme
    story.text = body.text
    story.date = body.date
    story.authorId = body.author_id
    story.author = get_username(story.authorId)
    story.likes = body.likes
    story.dislikes = body.dislikes
    story.currentUser = sessionStorage.getItem("id")
    story.author = 'author'
    story.diceSet = body.dice_set
    story.onLikeCallback = like
    story.onDislikeCallback = dislike
    story.render()

}

function get_username(userid) {
    $.ajax({
        type: "GET",
        url: API_GATEWAY + USERS_API,
        crossDomain: true,
        success: function (data) {
            var body = $.parseJSON(data)
            return body.username
        },
        error: function (errMsg) {
            $("#message").show()
        }
    });
}

function like(evt) {
    react(evt.data.id, 'like', evt.data.story)
}

function dislike(evt) {
    react(evt.data.id, 'dislike', evt.data.story)
}

function react(url, val, story) {
    let formData = new FormData()
    var payload = {}
    formData.append('react', val)
    formData.forEach((value, key) => {
        payload[key] = value
    });
    var json = JSON.stringify(payload)

    $.ajax({
        type: "POST",
        url: API_GATEWAY + STORIES_API + '/' + storyId + REACT_API,
        data: json,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: data => {
            if (val === 'like') {
                story.likes++;
                if (data.message==='Reaction updated')
                    story.dislikes--;
                story.update()
            } else {
                story.dislikes++;
                if (data.message==='Reaction updated')
                    story.likes--;
                story.update()
            }
            story.update()
        },
        error: function (errMsg) {
            if (errMsg.JSONValue.status == 401) {
                logout()
            } else {
                if (code != 400 && code != 404 && code != 403 && code != 410)
                    msg = 'An error occurred while processing your request. Please try again later.'
                $('#message').text(msg)
            }
        }
    });
}

function get_users() {
    $.ajax({
        type: "GET",
        url: API_GATEWAY + USERS_API,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType: "json",
        success: users_callback,
        error: function (errMsg) {
            $("#users-list").append("<h1> No users found </h1>")
            if (errMsg.status == 401) {
                logout()
            }
        }
    });
}

function users_callback(data, status, xhr) {
    data.forEach(user => {
        usercomponent = new UserComponent($('#users-list'), user['user_id'])
        usercomponent.username = user.username
        usercomponent.followmode=false
        usercomponent.firstname = user.firstname
        usercomponent.lastname = user.lastname
        usercomponent.render()
    });
}

function followed() {
    $.ajax({
        type: "GET",
        url: API_GATEWAY + FOLLOWED_API,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType: "json",
        success: followed_callback,
        error: function (errMsg) {
            $("#users-list").append("<h1> No users found </h1>")
            if (errMsg.status == 401) {
                logout()
            }
        }
    });
}

function followed_callback(data, status, xhr) {
    data.forEach(user => {
        usercomponent = new UserComponent($('#followed-list'), user.user_id)
        usercomponent.followmode = true
        usercomponent.username = user.username
        usercomponent.firstname = user.firstname
        usercomponent.lastname = user.lastname
        usercomponent.render()
    });
}

function unfollow(id){

    FOLLOW_API = FOLLOW_API.replace("ID", id)

    $.ajax({
        type: "DELETE",
        url: API_GATEWAY + FOLLOW_API,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType: "json",
        success: function () {
            alert("user unfollowed")
            window.location.href=STORIES_API
        },
        error: function (errMsg) {
            if (errMsg.status == 401) {
                logout()
            }
        }
    });
}

function follow(id){
    FOLLOW_API = FOLLOW_API.replace("ID", id)

    $.ajax({
        type: "POST",
        url: API_GATEWAY + FOLLOW_API,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType: "json",
        success: function () {
            alert("user followed")
        },
        error: function (errMsg) {
            if (errMsg.status == 401) {
                logout()
            }
            if (errMsg.status == 409) {
                alert("user already followed")
            }else {
                alert(errMsg.JSONValue.message)
            }
        }
    });
}

function get_users_story_list(id) {
    $.ajax({
        type: "GET",
        url: API_GATEWAY + STORIES_API + "?user_id=" + id,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success: users_stories_callback,
        error: function (errMsg) {
            $("#user-wall").html("<h3 class='display-5' style='margin-top: 4rem'> No stories published yet </h3>")
        }
    });
}

function users_stories_callback(data, status, xhr) {

    $("#user-wall").html(
        `
        <div class="jumbotron bg-white" id="page-content-wrapper">

            <h5><span id="user-name"></span>'s Wall</h5>
            <hr class="style1"> ` +

        (sessionStorage.getItem("id") == data[0].author_id ? `` : `
            <a href="#" class="btn btn-secondary"
                   onclick="follow(`+data[0].author_id+`)">Follow author</a>
                <br><br>
            `)
            + `
            
               <ul class="list-group"> <div class="row"><div class="col-md-12" id="story-list"></div></div></ul>
            
        </div>
         `
    )
    get_username(data['author_id'])
    story_callback(data, status, xhr)
}

function get_username(id) {
    $.ajax({
        type: "GET",
        url: API_GATEWAY + USERS_API + "/" + id,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType: "json",
        success: function (data, status, xhr) {
            $("#user-name").html(data.usernameValue)
        },
        error: function (errMsg) {
            $("#user-name").html("User")
        }
    });
}


function roll_dice() {
    dice = {
        dicenum: parseInt($(".active#dicenum").text().trim()),
        theme: $(".active#dicetheme").text().trim()
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
            if (errMsg.status == 200) {
                logout()
            }
            alert(errMsg.responseJSON.message)
        }
    });
}

function roll_dice_callback(data, status, xhr) {
    STORIES_EDIT = STORIES_EDIT.replace("ID", data.story_id)
    window.location.href = STORIES_EDIT
}

function submit_story(evt) {
    submit_story_request(is_draft = "False", id = evt.data.id)
}

function submit_draft(evt) {
    submit_story_request(is_draft = "True", id = evt.data.id)
}

function delete_story(evt) {
    $.ajax({
        type: "DELETE",
        url: API_GATEWAY + STORIES_API + "/" + evt.data.id,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType: "json",
        success: function () {
            window.location.href = '/'
        },
        error: function (errMsg) {
            logout();
        }
    });
}

function submit_story_request(is_draft, id) {
    story = {
        text: $('#story-text').val(),
        draft: is_draft
    }

    $.ajax({
        type: "PUT",
        data: JSON.stringify(story),
        url: API_GATEWAY + STORIES_API + "/" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {withCredentials: true},
        crossDomain: true,
        success: () => {
            window.location.href = STORIES_API
        },
        error: function (errMsg) {
            if (errMsg.status == 200) {
                logout()
            }
            alert(errMsg.responseJSON.message)
        }
    });
}

function story_edit_render(id) {
    $.ajax({
        type: "GET",
        url: API_GATEWAY + STORIES_API + "/" + id,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType: "json",
        success: story_edit_callback,
        error: function (errMsg) {
            $("#story-list").append("<h1> No stories found </h1>")
            logout()
        }
    });
}

function story_edit_callback(data, status, xhr) {

    storycomponent = new EditStoryComponent($('#story-edit-container'), data.id)
    storycomponent.theme = data.theme
    storycomponent.diceSet = data.dice_set
    storycomponent.text = data.text
    storycomponent.onSubmitCallback = submit_story
    storycomponent.onSubmitDraftCallback = submit_draft
    storycomponent.onCancelStoryCallback = delete_story
    storycomponent.render()

}

function calculate_statistics() {
    $.ajax({
        type: "GET",
        url: API_GATEWAY + STATISTICS_API + "/" + sessionStorage.getItem("id"),
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType: "json",
        success: statistics_callback,
        error: function (errMsg) {
            if (errMsg.status == 200) {
                logout()
            }
        }
    });
}

function statistics_callback(data, status, xhr) {
    $("#avg-dice").text(data.avg_dice)
    $("#num-dislikes").text(data.likes)
    $("#num-likes").text(data.dislikes)
    $("#num-stories").text(data.n_stories)
}



