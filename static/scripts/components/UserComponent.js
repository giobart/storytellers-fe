class UserComponent {

    set username(username) {
        this.usernameValue = username;
    }

    get username() {
        return this.usernameValue;
    }

    set firstname(firstname) {
        this.firstnameValue = firstname;
    }

    get firstname() {
        return this.firstnameValue;
    }

    set followmode(followmode) {
        this.followmodeValue = followmode;
    }

    get followmode() {
        return this.followmodeValue;
    }

    set lastname(lastname) {
        this.lastnameValue = lastname;
    }

    get lastname() {
        return this.lastnameValue;
    }

    set username(username) {
        this.usernameValue = username;
    }

    get username() {
        return this.usernameValue;
    }

    set id(id) {
        this.idValue = id;
    }

    get id() {
        return this.idValue;
    }

    set currentUser(currentUser) {
        this.currentUserValue = currentUser;
    }

    get id() {
        return this.currentUserValue;
    }

    render() {
        this.container.append(this.markup());
    }

    update() {
        $('#story-id-' + this.idValue).replaceWith(this.markup());
    }

    constructor(container, id) {
        this.container = container;
        this.idValue = id;
    }

    markup() {
        return `
      
                    <div class="list-group-item d-flex justify-content-between align-items-center"
                         id="user_{{ usr.id }}">
                        <a class="text-dark btn" disabled="true"
                           href="#" onclick="get_users_story_list(${this.idValue})">${this.usernameValue}</a> <br>` +

            (this.followmode==true ? `<a type="button" class="btn badge badge-danger badge-pill bg-danger text-white"
                       onclick="unfollow(${this.idValue})" href="#">
                        Unfollow
                    </a>` : ``)
            + `
                        <!--
                            <button type="button" class="badge badge-dark badge-pill btn" data-toggle="modal"
                                    data-target="#user_{{ usr.id }}_last_story">
                                Last Story
                            </button>
                        -->
                    </div>

                    <!-- user last story -->
                    <!--

                        <div class="modal fade" id="user_{{ usr.id }}_last_story" tabindex="-1" role="dialog"
                             aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLongTitle">Last story
                                            from {{ usr.username }}</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        {{ usr[1] }} <br> <br>
                                        Published: <i>{{ usr[2].day }}/{{ usr[2].month }}/{{ usr[2].year }}</i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {% endif %} -->

    `;
    }

}