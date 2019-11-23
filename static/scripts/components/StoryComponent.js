class StoryComponent {

    //callback = consumer(story_id)
    set onDeleteStoryCallback(callback) {
        this.deleteStoryCallbackFunc = callback
    }

    set theme(theme) {
        this.themeValue = theme;
    }

    get theme() {
        return this.themeValue;
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

    get likes() {
        return this.likesNumber;
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
        $('#delete-button-story-' + this.idValue).click({param1: this.idValue}, this.deleteStoryCallbackFunc)
    }

    update() {
        $('#story-id-' + this.idValue).replaceWith(this.markup());
        $('#delete-button-story-' + this.idValue).click({param1: this.idValue}, this.deleteStoryCallbackFunc)
    }

    constructor(container, id) {
        this.container = container;
        this.idValue = id;
    }

    markup() {
        return `
      
<li class=" text-light mycard ${this.themeValue} " id="story-id-${this.idValue}">
  <div class="container" >
      <div class="row">
          <div class="col-sm-12 center-block text-center">
          
              <p>
              <h5 class="story-text">
                <!-- if draft theme put draft badge -->
                ${this.themeValue == 'draft' ? '<span class="badge badge-warning badge-pill">Draft</span>' : ''}
                <b>${this.textValue}</b>
              </h5>
              <span style="margin-right: 1rem;">
                  Published: <i>${this.dateValue}</i>
                  | by: <a href="/users/${this.authorIdValue} " class="btn badge badge-pill badge-dark"> ${this.authorValue} </a>
              </span>
              </p >
  
              <i class="fas fa-thumbs-up"></i> <span
                  class="badge badge-seconary badge-pill"> ${this.likesNumber}</span> <i
                  class="fas fa-thumbs-down"></i> <span
                  class="badge badge-seconary badge-pill"> ${this.dislikesNumber}</span>
  
              <!--<a href="{{like_it_url}}{{story.id}}/1">Like it!</a>-->
  
              <a class="btn btn-primary" href="/stories/${this.idValue}">Read this
                  story</a>
  
              <!-- DELETE BUTTON IF CURRENT USER IS THE CREATOR OF THE STORY-->
              ${this.currentUserValue == this.authorValue ? `<a class="btn btn-danger" id="delete-button-story-${this.idValue}">Delete</a> ` : ''}
              <!-- if draft theme put draft badge -->
              ${this.themeValue == 'draft' ? `<a class="btn btn-warning" href='/stories/${this.idValue}/edit'>Edit</a>\n` : ''}
  
          </div>
  
      </div>
  
  </div>
</li>
<br> 

    `;
    }

}