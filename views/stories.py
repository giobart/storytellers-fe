from flask import Blueprint, render_template

stories = Blueprint('stories', __name__)


@stories.route('/new_story')
def new_story():
    return render_template('new_story.html')


@stories.route('/stories')
def stories_list():
    return render_template('stories.html')


@stories.route('/stories/<storyid>')
def show_story(storyid):
    return render_template('story.html')


@stories.route('/stories/<storyid>/edit')
def edit_story(storyid):
    return render_template('edit_story.html')
