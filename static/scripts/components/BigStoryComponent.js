class BigStoryComponent {

    //callback = consumer(story_id)
    set onLikeCallback(callback) {
        this.onLikeCallbackFunc = callback
    }

    //callback = consumer(story_id)
    set onDislikeCallback(callback) {
        this.onDislikeCallbackFunc = callback
    }

    set theme(theme) {
        this.themeValue = theme;
    }

    get theme() {
        return this.themeValue;
    }

    // array of dices: example ['mouse','car','airplane']
    set diceSet(diceSet) {
        this.diceSetValue = diceSet;
    }

    get diceSet() {
        return this.diceSetValue;
    }

    set text(text) {
        this.textValue = text;
    }

    get text() {
        return this.textValue;
    }

    set date(date) {
        this.dateValue = date;
    }

    get date() {
        return this.dateValue;
    }

    set author(author) {
        this.authorValue = author;
    }

    get author() {
        return this.authorValue;
    }

    set authorId(authorid) {
        this.authorIdValue = authorid;
    }

    get authorId() {
        return this.authorIdValue;
    }

    set likes(likes) {
        this.likesNumber = likes;
    }

    get likes() {
        return this.likesNumber;
    }

    set dislikes(dislikes) {
        this.dislikesNumber = dislikes;
    }

    get dislikes() {
        return this.dislikesNumber;
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
        $('#like-button-story-' + this.idValue).click({id: this.idValue}, this.onLikeCallbackFunc)
        $('#dislike-button-story-' + this.idValue).click({id: this.idValue}, this.onDislikeCallbackFunc)
    }

    update() {
        $('#big-story-' + this.idValue).replaceWith(this.markup());
        $('#like-button-story-' + this.idValue).click({id: this.idValue}, this.onLikeCallbackFunc)
        $('#dislike-button-story-' + this.idValue).click({id: this.idValue}, this.onDislikeCallbackFunc)
    }

    constructor(container, id) {
        this.container = container;
        this.idValue = id;
        this.currentUserValue = ''
    }

    markup() {
        return `
        
<div id="big-story-${this.idValue}">
    <div class="bg-image ${this.themeValue}"></div>
    <div class=" justify-content-center align-items-center bg-text">
    
    
        <div class="mycard transparent-bg">
    
    
            <div class="container">
                    <br>
                    <!-- DRAFT BADGE -->
                    ${(this.themeValue == 'draft') ? '<h4 class="story-text"><span class="badge badge-warning badge-pill">Draft</span></h4><br>' : ''}
    
                    <!-- DICE USED -->
                    <div class="row">
                        <div class="col-sm-12 center-block text-center">
                            <h5>Dice used </h5>
                            <hr class="style2">
                        </div>
                    </div>
                    <div class="row">
                        ${this.diceSetValue.map(die => `
                            <div class="col">
                                <div class="card card-block d-flex bg-transparent border border-light text-white mb-3"
                                     style="width: 8rem; height: 8rem;">
                                    <div class="card-body align-items-center d-flex justify-content-center">
                                        <h5 class="card-title ">${die}</h5>
                                    </div>
                                </div>
                            </div>`).join(' ')
                        }
                    </div>
                    
                <br>
    
                <div class="row">
                    <div class="col-sm-12 center-block text-center">
                        <h5>Story</h5>
                        <hr class="style2">
                    </div>
                </div>
    
                <div class="row">
                    <div class="col-sm-12 center-block text-center">
    
                        <!-- EDIT BADGE -->
                        ${(this.themeValue == 'draft' && this.currentUserValue == this.author) ? `<a class="btn btn-warning" href="/stories/${this.idValue}/edit">Edit</a>` : ''}
    
                        <p style="text-justify: auto">
                            <h5 class="text-justify">
                                <b>${this.textValue}</b>
                            </h5>
                        </p>
                    </div>
                </div>
                <br>
                ` + (this.currentUserValue != '' ? `
                        
                <!-- IF USERS IS LOGGED SHOW LIKE DISLIKE, DATE, AUTHOR -->
                            <div class="row">
                                <div class="col-md-6"></div>
                                <div class="col-md-6">
                                    <b><span id="message" class="text-danger"></span></b>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <span style="margin-right: 1rem;">Published: <i>${this.dateValue}</i></span>
                                </div>
                                <div class="col-md-4">
                                    <i name="like" class="btn btn-primary  fas fa-thumbs-up" id="like-button-story-${this.idValue}"></i>
                                    <span class="badge badge-seconary badge-pill" id="likes"> ${this.likesNumber} </span>
    
                                    <i name="like" class="btn btn-danger fas fa-thumbs-down" id="dislike-button-story-${this.idValue}" ></i>
                                    <span class="badge badge-seconary badge-pill"
                                          id="dislikes"> ${this.dislikesNumber} </span>
                                </div>
                                <div class="col-md-4">
                                    Author: <a href="/users/${this.authorIdValue} "
                                               class="btn badge badge-pill badge-dark"> ${this.authorValue} </a>
                                </div>
                            </div>
                            ` : ``) + `
            </div>
        </div>
    </div>
</div>
    `;
    }

}