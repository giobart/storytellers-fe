class EditStoryComponent {

    //callback = consumer(story_id)
    set onSubmitCallback(callback) {
        this.onSubmitCallbackFunc = callback
    }

    set onSubmitDraftCallback(callback) {
        this.onSubmitDraftCallbackFunc = callback
    }

    set onCancelStoryCallback(callback) {
        this.onCancelCallbackFunc = callback
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

    set id(id) {
        this.idValue = id;
    }

    get id() {
        return this.idValue;
    }

    render() {
        this.container.append(this.markup());
        $('#submit-button-story').click({id: this.idValue}, this.onSubmitCallbackFunc)
        $('#submit-draft-button-story').click({id: this.idValue}, this.onSubmitDraftCallbackFunc)
        $('#cancel-button-story').click({id: this.idValue}, this.onCancelCallbackFunc)
    }

    update() {
        this.container.html(this.markup());
        $('#submit-button-story').click({id: this.idValue}, this.onSubmitCallbackFunc)
        $('#submit-draft-button-story').click({id: this.idValue}, this.onSubmitDraftCallbackFunc)
        $('#cancel-button-story').click({id: this.idValue}, this.onCancelCallbackFunc)
    }

    constructor(container, id) {
        this.container = container;
        this.idValue = id;
        this.currentUserValue = ''
    }

    markup() {
        return `
        
<div class="bg-image ${this.themeValue}" id="bg-image"></div>

    <div class="container d-flex flex-wrap align-items-center bg-text" name="edit-story-container">
        <div class="jumbotron w-100 transparent-bg">

            <form action="javascript:void(0);">

                <div class="row">
                    <div class="col-sm-12 center-block text-center">
                        <h5>Current dice values </h5>
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
                <div class="row">
                    <div class="col-sm-12 center-block text-center">
                        <br> <textarea class="form-control rounded-0" rows="5" id="story-text">${this.text}</textarea> <br> <br>

                        <button type="button" id="submit-button-story" class="btn btn-success" >Submit Story</button>
                        <button type="button" id="submit-draft-button-story" class="btn btn-primary">Submit Draft Story</button>
                        <button type="button" id="cancel-button-story" class="btn btn-danger" >Cancel</button>
            </form>
        </div>
    </div>

    </div>
    `;
    }

}