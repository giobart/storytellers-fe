from flask import Blueprint, render_template

users = Blueprint('users', __name__)


@users.route('/users')
def new_story():
    return render_template('users.html')



