from flask import Blueprint, render_template

home = Blueprint('home', __name__)


@home.route('/')
def index():
    '''
    Calls the main page of the application.

    Returns:
        200 -> the user's homepage if a user was logged in.  The user's homepage
            is filled with the user's stories ordered by date and with the user's
            statistics.
        200 -> the application's welcome page if no user was logged in
    '''
    return render_template('index.html', like_it_url='http://127.0.0.1:5000/stories/')
